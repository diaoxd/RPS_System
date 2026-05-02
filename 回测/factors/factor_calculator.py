import pandas as pd
import numpy as np

class FactorCalculator:


    @staticmethod
    def calc_momentum(df, n=20):


        df[f'mom_{n}'] = df['close'].pct_change(n)

        return df


    @staticmethod
    def calc_volatility(df, n=20):


        df[f'vol_{n}'] = df['close'].pct_change().rolling(n).std()

        return df


    @staticmethod
    def calc_rsi(df, n=14):


        delta = df['close'].diff()

        gain = delta.clip(lower=0).rolling(n).mean()

        loss = (-delta.clip(upper=0)).rolling(n).mean()

        rs = gain / (loss + 1e-8)

        df[f'rsi_{n}'] = 100 - 100 / (1 + rs)

        return df


    @staticmethod
    def calc_reversal_volume(df, n=20):


        df['ret_20'] = df['close'].pct_change(n)

        df['vol_ratio'] = df['volume'] / df['volume'].rolling(n).mean()

        df['reverse_factor'] = -df['ret_20'] * df['vol_ratio']

        return df


    def calc_all(self, df):


        df = self.calc_momentum(df)

        df = self.calc_volatility(df)

        df = self.calc_rsi(df)

        df = self.calc_reversal_volume(df)

        return df
