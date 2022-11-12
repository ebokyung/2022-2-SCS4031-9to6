from tensorflow.keras.applications import inception_resnet_v2, nasnet
import tensorflow as tf

NasNet = 'NasNet'
Inception = 'Inception'
target_size = {NasNet: (331, 331),
               Inception: (299, 299)}


class BaseModel:
    def __init__(self, pretrain_net, trainable):
        self.trainable = trainable
        self.pretrain_net = pretrain_net

        if self.pretrain_net == Inception:
            self.base_model = inception_resnet_v2.InceptionResNetV2(
                weights='imagenet',
                include_top=False,
                input_shape=target_size[self.pretrain_net] + (3,)
            )
        elif self.pretrain_net == NasNet:
            self.base_model = nasnet.NASNetLarge(
                weights='imagenet',
                include_top=False,
                input_shape=target_size[self.pretrain_net] + (3,)
            )
        self.base_model.trainable = self.trainable

    def change_trainable(self, trainable):
        self.trainable = trainable
        self.base_model.trainable = self.trainable
