from sklearn.model_selection import train_test_split
from sklearn.neural_network import MLPClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
import pickle

from flask import *
from flask import Flask
from flask import request
import csv
import json

root_path = "C:\Botathon\haptikhackathon"

max_score = 0
pickle_to_use = ''

names = ["Nearest Neighbors", "Linear SVM", "RBF SVM", "Gaussian Process",
        "Decision Tree", "Random Forest", "Neural Net", "AdaBoost",
         "Naive Bayes", "QDA"]

classifiers = [
    KNeighborsClassifier(3),
    SVC(kernel="linear", C=0.025),
    SVC(gamma=2, C=1),
    GaussianProcessClassifier(1.0 * RBF(1.0), warm_start=True),
    DecisionTreeClassifier(max_depth=5),
    RandomForestClassifier(max_depth=5, n_estimators=10, max_features=1),
    MLPClassifier(alpha=1),
    AdaBoostClassifier(),
    GaussianNB(),
    QuadraticDiscriminantAnalysis()]

try:
    app = Flask(__name__)
except:
    print "Failed to start the Flask application !!"


@app.route('/')
def hello_world():
    return 'Hello, World!!!'

@app.route('/Train', methods=['GET', 'POST'])
def Train():
    global max_score
    global pickle_to_use

    X = []
    Y = []

    file_path = root_path + "\datasets\diabetes.csv"
    with open(file_path, 'r') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            X.append([float(row['Pregnancies']), float(row['Glucose']), float(row['BloodPressure']), float(row['SkinThickness']),
                        float(row['Insulin']), float(row['BMI']), float(row['DiabetesPedigreeFunction']), float(row['Age'])  ])
            Y.append(float(row['Outcome']))

        csvfile.close()

    X_train, X_test, y_train, y_test = train_test_split(X, Y, test_size=.2)

    for name, clf in zip(names, classifiers):
        clf.fit(X_train, y_train)
        score = clf.score(X_test, y_test)

        file = root_path + '\pickel_files'+ str(name) + ".p"
        with open(file, "wb") as f:
            pickle.dump(clf, f)
            f.close()

        if score > max_score:
            max_score = score
            pickle_to_use = name


    return jsonify({'status':'success', 'Algo': pickle_to_use, 'Score': max_score})

@app.route('/Test', methods=['GET', 'POST'])
def Test():
    user_input = json.loads(request.get_data())

    file = root_path + '\pickel_files' + str(user_input["Algo"]) + ".p"

    f = open(file,'rb')
    clf_predict = pickle.load(f)
    f.close()

    prediction = clf_predict.predict(user_input['val'])

    return jsonify({'status': 'success', 'Prediction': str(prediction[0])})

if __name__ == "__main__" :
    try:
        app.run(host='0.0.0.0', port=9100)
    except:
        print "Failed to start the Application !!"