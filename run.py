import subprocess

# you can run me by writing: py run.py
install1 = "npm install"
install2 = "npm install"
cmd1 = "npm start"
cmd2 = "npm start"
while True:
    answer = input("Do you want to run npm i? (y/n) ").lower()
    if answer == "y":
        print("installing packages...")
        process1 = subprocess.Popen(install1, shell=True, cwd="./Main", stdout=subprocess.PIPE)
        process2 = subprocess.Popen(install2, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)
        process3 = subprocess.Popen(cmd1, shell=True, cwd="./Main", stdout=subprocess.PIPE)
        process4 = subprocess.Popen(cmd2, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)
        while True:
            print("starting the engine...")
            output1 = process1.stdout.readline().decode('utf-8').strip()
            output2 = process2.stdout.readline().decode('utf-8').strip()
            output3 = process3.stdout.readline().decode('utf-8').strip()
            output4 = process4.stdout.readline().decode('utf-8').strip()
            if output1 == '' and output2 == '' and output3 == '' and output4 == '' and process1.poll() is not None and process2.poll() is not None and process3.poll() is not None and process4.poll() is not None:
                break
            if output1:
                print(output1)
            if output2:
                print(output2)
        break
    elif answer == "n":
        print("starting the engine...")
        process1 = subprocess.Popen(cmd1, shell=True, cwd="./Main", stdout=subprocess.PIPE)
        process2 = subprocess.Popen(cmd2, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)
        while True:
            output1 = process1.stdout.readline().decode('utf-8').strip()
            output2 = process2.stdout.readline().decode('utf-8').strip()
            if output1 == '' and output2 == '' and process1.poll() is not None and process2.poll() is not None:
                break
            if output1:
                print(output1)
            if output2:
                print(output2)
        break
    else:
        print("Invalid input, please enter 'y' or 'n'")
process1 = subprocess.Popen(cmd1, shell=True, cwd="./Main", stdout=subprocess.PIPE)
process2 = subprocess.Popen(cmd2, shell=True, cwd="./Analytics", stdout=subprocess.PIPE)


