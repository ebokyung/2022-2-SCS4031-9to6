import tensorflow as tf
from tensorflow.keras.models import Sequential, Model
from tensorflow.keras import layers
from tensorflow.keras.applications import inception_resnet_v2, nasnet
from tf_basemodel import BaseModel

NasNet = 'NasNet'
Inception = 'Inception'
target_size = {NasNet: (331, 331),
               Inception: (299, 299)}
EPOCHS = 1000


class CNNModel:
    def __init__(self, config, base_model):
        inputs = layers.Input(shape=target_size[config.pretrain_net] + (3,))
        x = base_model(inputs)
        x = layers.GlobalAveragePooling2D()(x)
        x = layers.Dropout(config.dropout)(x)
        x = layers.Dense(config.dense, activation=config.activation)(x)
        outputs = layers.Dense(1, activation='sigmoid')(x)

        self.model = Model(inputs=inputs,
                           outputs=outputs,
                           name='binary_flood')