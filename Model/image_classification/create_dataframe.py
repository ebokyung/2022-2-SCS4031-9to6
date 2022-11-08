import pandas as pd
from glob import glob
from sklearn.model_selection import train_test_split

class CreateDataFrame:
    def __init__(self):
        # flood : 1, normal : 0
        flood_df = pd.DataFrame({'path': glob('../data/binary/flood/*.jpg'),
                                 'label': '1'})
        print('flood len : {}'.format(len(flood_df)))
        normal_df = pd.DataFrame({'path': glob('../data/binary/normal/*.jpg'),
                                  'label': '0'})
        print('normal len : {}'.format(len(normal_df)))

        self.df = pd.concat([flood_df, normal_df], axis=0)

        # shuffle
        self.df = self.df.sample(frac=1)

        # split
        self.x_train, self.x_test, self.y_train, self.y_test = train_test_split(self.df['path'],
                                                                                self.df['label'],
                                                                                stratify=self.df['label'],
                                                                                test_size=0.2)
        self.train_df = pd.DataFrame({'path': self.x_train,
                                      'label': self.y_train})
        self.valid_df = pd.DataFrame({'path': self.x_test,
                                      'label': self.y_test})
