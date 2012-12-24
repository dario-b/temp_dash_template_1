
#!/usr/bin/python
import time
from random import randint

a = 1
while a == 1 :
 num1 = randint(1,100)
 num2 = randint(1,100)

 str1 = "Recv:AABBCCDDEE,30/06/2014-13:40,133,"
 str2 = "Recv:FFGGHHIIJJ,30/06/2014-13:40,133,"

 strx = str1 + str(num1)
 stry = str2 + str(num2)
 print strx
 time.sleep(2)
 print stry
 time.sleep(2)
