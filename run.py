import subprocess

cmd1 = "npm start"
cmd2 = "npm start"

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
