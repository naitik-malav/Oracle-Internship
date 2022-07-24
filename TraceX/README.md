# TraceX

## Introduction
TraceX is a devtools extension TraceX which allows you to grab the trace-ids, microservices URL, start time and time duration on Oracle Fusion Cloud Applications and generate the Octo links to trace report. It helps in distributed tracing of Microservices based architecture system.

## Working Mechanism, API's and Methods Used:
### Overview: 
The HTTP Archive format (HAR) is used to represent information about network requests. It tracks all the logging of web browser's interaction with a site. So we have used chrome.devtools.network.getHAR() method which returns the entire HAR log. The x-b3-traceid, start time, requested url, and time duration will then be obtained from the HAR log. Octo link to trace view can be generated using x-b3-traceid. If the Developer Tools window is opened after the page is loaded, some requests may be missing in the array of entries returned by getHAR(). Reload the page to get all requests. In general, the list of requests returned by getHAR() should match that displayed in the Network panel.

### chrome.runtime.onConnect(): 
To keep the track of whether DevTools window is active or not I have added an onConnect listener to the background page and use the connect() method from the DevTools page.
    
### Message Passing: 
Communication between extensions and their content scripts works by using message passing. So, ports are designed as a two-way communication method between different parts of the extension, where a (top-level) frame is viewed as the smallest part. Upon calling runtime.connect a Port is created and this port can immediately be used for sending messages to the other end via postMessage.

### chrome.devtools.panels: 
This API is used to integrate the Octo extension into the Developers Tool Window.

## Downloads
Download and unpack the zip file. Or clone the repository TraceX. 

## Installation 
### Chrome:
1. Open Google Chrome and go to chrome://extensions/ page. (Or click on Settings->Extensions) 
2. Enable developer mode(if it's not already).
3. Click on the Load unpacked extension.
4. Navigate to the folder where you have cloned this repository. Select the folder for this extension. 
5. You can find TraceX extension in extensions tab.

## Execution Instructions
You can test the TraceX on expenses.
1. Right click and select Inspest Element to open DevTools.
2. Open Network Tab in DevTools.
3. Reload Network tab.
4. Click on the TraceX extension and select the Trace Log option and hit the Get button. 
5. Now you can find Octo tab next to Network Tab in DevTools.
6. Click on the Octo tab to get all the required information.

Please refer above pdf for references and various detailed flowcharts and images.
