import requests
import RPi.GPIO as GPIO
from time import sleep
 
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
 
while True:
  if GPIO.input(7) == GPIO.HIGH:
    # print("Pin 7 is HIGH!")
    requests.get('http://localhost:8000/pick-idea')
  # elif GPIO.input(7) == GPIO.LOW:
    # print("Pin 7 is LOW...")
  sleep(0.05)
