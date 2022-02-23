#include <ArduinoBLE.h>

#define GND 5
#define PINUP 6
#define PINDOWN 7
#define POWERPIN 8
long previousMillis = 0;
int interval = 0;
int ledState = LOW;



BLEService ledService("19B10000-E8F2-537E-4F6C-D104768A1214"); // BLE LED Service

// BLE LED Switch Characteristic - custom 128-bit UUID, read and writable by central
BLEByteCharacteristic switchCharacteristic("2A57", BLERead | BLEWrite);

void setup() {
  Serial.begin(9600);
  // set built in LED pin to output mode
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(PINUP, OUTPUT);
  pinMode(PINDOWN, OUTPUT);
  pinMode(POWERPIN, OUTPUT);
  pinMode(POWERPIN, INPUT);
  

  // begin initialization
  if (!BLE.begin()) {

    while (1);
  }

  // set advertised local name and service UUID:
  BLE.setLocalName("Nano 33 IoT");
  BLE.setAdvertisedService(ledService);

  // add the characteristic to the service
  ledService.addCharacteristic(switchCharacteristic);

  // add service
  BLE.addService(ledService);

  // set the initial value for the characteristic:
  switchCharacteristic.writeValue(0);

  // start advertising
  BLE.advertise();
  Serial.println("BLE Central - LED control");

}

void loop() {
  // listen for BLE peripherals to connect:
  BLEDevice central = BLE.central();

  // if a central is connected to peripheral:
  if (central) {
    Serial.print("connacted");
    // while the central is still connected to peripheral:
    while (central.connected()) {
      // if the remote device wrote to the characteristic,
      // use the value to control the LED:
      if (switchCharacteristic.written()) {
        Serial.print("read Value");
        Serial.print(switchCharacteristic.value());
        switch (switchCharacteristic.value()) {   // any value other than 0
          case 00:
            digitalWrite(LED_BUILTIN, LOW);
            digitalWrite(PINUP, LOW);  
            digitalWrite(PINDOWN, LOW);  
            break;
          case 01:
            digitalWrite(LED_BUILTIN, HIGH);            // will turn the LED on and reali 1 on
            digitalWrite(PINUP, HIGH ); 
            digitalWrite(PINDOWN, LOW);
              
            break;
          case 02:
              digitalWrite(LED_BUILTIN, HIGH);         // will turn the LED on relai 2 on
              digitalWrite(PINUP, LOW); 
              digitalWrite(PINDOWN, HIGH); 
            break;
          default:
            digitalWrite(LED_BUILTIN, LOW);          // will turn the LED off and the relai off
            digitalWrite(PINUP, LOW);  
            digitalWrite(PINDOWN, LOW);  
            break;
        }
      }
    }

    // when the central disconnects, print it out:
    Serial.print(F("Disconnected from central: "));
    Serial.println(central.address());
    digitalWrite(LED_BUILTIN, LOW);         // will turn the LED and the relai off
    digitalWrite(PINUP, LOW);  
    digitalWrite(PINDOWN, LOW);  
  }
}
