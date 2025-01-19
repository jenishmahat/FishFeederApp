/* for demo as daily and weekly feed takes time,set demo boolen variable to true and set feed interval where you can feed in minute interval*/
#include <WiFi.h>
#include <ESPAsyncWebServer.h> //Search for Library in Library manager and install
#include <NTPClient.h>     //Search for Library in Library manager and install
#include <WiFiUdp.h>      
#include <ESP32Servo.h>//Search for Library in Library manager and install
#include <TimeLib.h> // //Search for Time Library in Library manager and install

#include <soc/soc.h> 
#include <soc/rtc.h>

// Replace with your network credentials
const char* ssid = "NetComm 9234";
const char* password = "5pPVKfrg88kJeDSy";

// Create an NTP client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", 36000, 60000); // Set offset to 36000 seconds (10 hours) - change if your timezone is different

// Create an AsyncWebServer object on port 80
AsyncWebServer server(80);

// Variables to store the scheduled feeding time and frequency
int feedHour = 0;
int feedMinute = 0;
int feedDay = 0;
int feedMonth = 0;
int feedFrequency = 1; // Frequency in days
time_t firstFeedTime = 0; // Store the time of the first feed
time_t nextFeedTime = 0; // Store the next feed time

// Variables for demo feed
bool demoFeed = true;
int demoFeedMinutes = 1; // Set the minutes interval for demo feeding

// GPIO pin for controlling the fish feeder servo
const int feederServoPin = 13;
Servo feederServo;

unsigned long previousMillis = 0;
const unsigned long feedingDuration = 5000; // Duration to keep the servo in feeding position (5 seconds)
unsigned long feedPauseDuration = 60000; // Minimum pause duration after feeding (1 minute)
bool isFeeding = false;

void handleSchedule(AsyncWebServerRequest *request){
    if (request->hasParam("time") && request->hasParam("date") && request->hasParam("frequency")) {
        String time = request->getParam("time")->value();
        String date = request->getParam("date")->value();
        String frequency = request->getParam("frequency")->value();

        // Print the scheduled feeding details to the serial monitor
        Serial.println("Scheduled feeding:");
        Serial.println("Time: " + time);
        Serial.println("Date: " + date);
        Serial.println("Frequency: " + frequency);

        // Parse the time string
        int colonIndex = time.indexOf(':');
        feedHour = time.substring(0, colonIndex).toInt();
        feedMinute = time.substring(colonIndex + 1).toInt();

        // Parse the date string
        int dashIndex = date.indexOf('-');
        feedDay = date.substring(0, dashIndex).toInt();
        feedMonth = date.substring(dashIndex + 1).toInt();
        
        // Set the feed frequency
        if (frequency == "Daily") {
            feedFrequency = 1;
        } else if (frequency == "Weekly") {
            feedFrequency = 7;
        } else if (frequency == "Bi-weekly") {
            feedFrequency = 14;
        }

        // Convert the scheduled date and time to a time_t value
        tm scheduledTime = {0};
        scheduledTime.tm_year = year() - 1900; // tm_year is years since 1900
        scheduledTime.tm_mon = feedMonth - 1;
        scheduledTime.tm_mday = feedDay;
        scheduledTime.tm_hour = feedHour;
        scheduledTime.tm_min = feedMinute;
        firstFeedTime = mktime(&scheduledTime);
        nextFeedTime = firstFeedTime; // Initialize next feed time

        // Send a success response to the client
        request->send(200, "text/plain", "Feeding scheduled successfully");
    } else {
        Serial.println("Error: Missing one or more parameters");
        request->send(400, "text/plain", "Error: Missing one or more parameters");
    }
}

void setup() {
  // Initialize serial communication
  Serial.begin(115200);
  WRITE_PERI_REG(RTC_CNTL_BROWN_OUT_REG, 0); // Disable brownout detection
  // Connect to Wi-Fi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP()); // Display the IP address

  // Initialize the NTP client
  timeClient.begin();

  // Attach the servo to the pin
  feederServo.attach(feederServoPin);
  feederServo.write(0); // Initialize the servo position

  // Define the ping endpoint
  server.on("/ping", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "pong");
  });

  // Define the manual feed endpoint
  server.on("/feed", HTTP_GET, [](AsyncWebServerRequest *request) {
    Serial.println("Feeding started"); 
    feedFish();
    request->send(200, "text/plain", "Feeding initiated");
  });

  // Define the schedule endpoint
  server.on("/schedule", HTTP_GET, handleSchedule);

  // Define the demo feed endpoint
  server.on("/demo", HTTP_GET, [](AsyncWebServerRequest *request) {
    if (request->hasParam("minutes")) {
      String minutes = request->getParam("minutes")->value();
      demoFeedMinutes = minutes.toInt();
      if (demoFeedMinutes < 1) {
        demoFeedMinutes = 1; // Ensure minimum feeding time is 1 minute
      }
      demoFeed = true;
      Serial.println("Demo feeding activated for every " + String(demoFeedMinutes) + " minutes.");
      request->send(200, "text/plain", "Demo feeding activated");
    } else {
      request->send(400, "text/plain", "Error: Missing minutes parameter");
    }
  });

  // Start the server
  server.begin();
}

void loop() {
  // Update the NTP client to get the current time
  timeClient.update();

  // Get the current hour, minute, day and month
  int currentHour = timeClient.getHours();
  int currentMinute = timeClient.getMinutes();
  time_t currentTime = now(); // Get current time

  // Calculate the next feed time based on the first feed time and frequency
  if (!demoFeed) {
    if ((currentTime >= nextFeedTime) && !isFeeding && (millis() - previousMillis >= feedPauseDuration)) {
      feedFish();
      nextFeedTime += (feedFrequency * 24 * 60 * 60); // Calculate the next feed time
    }
  } else {
    if ((millis() - previousMillis) >= (demoFeedMinutes * 60000) && !isFeeding && (millis() - previousMillis >= feedPauseDuration)) {
      feedFish();
    }
  }

  // Check if feeding duration has elapsed
  if (isFeeding && (millis() - previousMillis >= feedingDuration)) {
    feederServo.write(0); // Return the servo to the original position
    isFeeding = false;
    previousMillis = millis(); // Record the time when feeding ended to ensure 1-minute pause
  }
}

void feedFish() {
  // Rotate the servo to feed the fish
  feederServo.write(90); // Adjust this value as needed to dispense the food
  previousMillis = millis(); // Record the time when feeding started
  isFeeding = true;
}
