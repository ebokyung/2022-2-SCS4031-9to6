import wandb
from wandb.keras import WandbCallback
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras import layers
import tensorflow.keras as keras
from tensorflow.data import Dataset

from tensorflow.keras.optimizers import Adam, RMSprop, Nadam, SGD
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import inception_resnet_v2, nasnet
from sklearn.model_selection import train_test_split

from tf_basemodel import BaseModel
from tf_model import CNNModel
from create_dataframe import CreateDataFrame

# Config
CLASSES = ['normal', 'flood']
NasNet = 'NasNet'
Inception = 'Inception'
target_size = {NasNet: (331, 331),
               Inception: (299, 299)}
EPOCHS = 1000

config_defaults = {
    'pretrain_net': Inception,
    'epochs': EPOCHS,
    'batch_size': 50,
    'dropout': 0.5,
    'learning_rate': 1e-3,
    'activation': 'relu',
    'optimizer': 'adam',
    'dense': 1024
}

# Pass your defaults to wandb.init
wandb.init(config=config_defaults, project='flood24')
config = wandb.config

train_datagen = ImageDataGenerator(rescale=1. / 255,
                                   rotation_range=30,
                                   shear_range=0.2,
                                   zoom_range=0.3,
                                   horizontal_flip=True,
                                   vertical_flip=True,
                                   fill_mode='nearest')
valid_datagen = ImageDataGenerator(rescale=1. / 255)

dataframe = CreateDataFrame()
train_df = dataframe.train_df
valid_df = dataframe.valid_df


# Your model here ...
def main():
    # dataset
    train_generator = train_datagen.flow_from_dataframe(train_df,
                                                        x_col='path',
                                                        y_col='label',
                                                        target_size=target_size[config.pretrain_net],
                                                        class_mode='binary',
                                                        batch_size=config.batch_size)
    valid_generator = valid_datagen.flow_from_dataframe(valid_df,
                                                        x_col='path',
                                                        y_col='label',
                                                        target_size=target_size[config.pretrain_net],
                                                        class_mode='binary',
                                                        batch_size=config.batch_size)
    BASEMODEL = BaseModel(config.pretrain_net, False)
    base_model = BASEMODEL.base_model

    CNNMODEL = CNNModel(config, base_model)
    model = CNNMODEL.model

    es = EarlyStopping(monitor='loss',
                       mode='auto',
                       patience=5,
                       verbose=1)

    ckpt_path = '../data/weight/{net}_{bs}_{do}_{lr}_{acti}_{opt}_{dense}.ckpt'.format(net=config.pretrain_net,
                                                                                       bs=config.batch_size,
                                                                                       do=config.dropout,
                                                                                       lr=config.learning_rate,
                                                                                       acti=config.activation,
                                                                                       opt=config.optimizer,
                                                                                       dense=config.dense)
    checkpointer = ModelCheckpoint(filepath=ckpt_path,
                                   monitor='val_loss',
                                   save_weights_only=True,
                                   save_best_only=True,
                                   verbose=1)

    if config.optimizer == 'sgd':
        optimizer = SGD(learning_rate=config.learning_rate)
    elif config.optimizer == 'rmsprop':
        optimizer = RMSprop(learning_rate=config.learning_rate)
    elif config.optimizer == 'adam':
        optimizer = Adam(learning_rate=config.learning_rate)

    model.compile(loss='binary_crossentropy',
                  optimizer=optimizer,
                  metrics=['accuracy'])

    _ = model.fit(train_generator,
                  validation_data=valid_generator,
                  verbose=1,
                  epochs=config.epochs,
                  callbacks=[WandbCallback(), es, checkpointer],
                  steps_per_epoch=len(train_df) // config.batch_size)


if __name__ == '__main__':
    main()

# Usage
# wandb sweep sweep.yaml
# wandb agent hkleee/flood24/sweep_id