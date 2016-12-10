import csv
import json
import sys
if len(sys.argv) == 3:
    jsonFile = open(sys.argv[2],'w')
    with open(sys.argv[1],'r') as csvfile:
        reader = csv.DictReader(csvfile,('Pregnancies','Glucose','BloodPressure','SkinThickness','Insulin','BMI','DiabetesPedigree','Age','Outcome'))
        json.dump([row for row in reader],jsonFile)
    jsonFile.close()
