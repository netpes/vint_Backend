import subprocess

class run():
# you can run me by writing: py run.py
    install = "npm install"
    start = "npm start"
    def installPackages(self):
        process1 = subprocess.Popen(self.install, shell=True, cwd="./Main", stdout=subprocess.PIPE)
        process2 = subprocess.Popen(self.install, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)
        while True:
            output1 = process1.stdout.readline().decode('utf-8').strip()
            output2 = process2.stdout.readline().decode('utf-8').strip()
            if output1 == '' and output2 == ''  and process1.poll() is not None and process2.poll() is not None:
                break
            if output1:
                print(output1)
            if output2:
                print(output2)
    def runEngine(self):
        process1 = subprocess.Popen(start, shell=True, cwd="./Main", stdout=subprocess.PIPE)
        process2 = subprocess.Popen(start, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)
        while True:
            output1 = process1.stdout.readline().decode('utf-8').strip()
            output2 = process2.stdout.readline().decode('utf-8').strip()
            if output1 == '' and output2 == '' and process1.poll() is not None and process2.poll() is not None:
                break
            if output1:
                print(output1)
            if output2:
                print(output2)

    def run(self):
        while True:
            answer = input("Do you want to run npm i? (y/n) ").lower()
            if answer == "y":
                print("installing packages...")
                self.installPackages()
                self.runEngine()
                break
            elif answer == "n":
                print("starting the engine...")
                runEngine()
                break
            else:
                print("Invalid input, please enter 'y' or 'n'")

