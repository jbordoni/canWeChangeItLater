import json
import numpy as np
from numbers import Number
import sys
import os 

fileFolder = os.path.dirname(os.path.realpath(__file__))
dataFolder = os.path.join(fileFolder, "spotify-charts-data")

country = 'ar'

countryFolder = os.path.join(dataFolder, country)

weeks = os.listdir(countryFolder)

print weeks