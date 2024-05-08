---
layout: post
title:  "How I use ChatGPT as my personal carsharing agent 🚀"
date:   2024-04-28 10:00:00 +0200
permalink: /:title/
cover: "/images/custom-gpt-ep1/cover.png"
cover2x: "/images/custom-gpt-ep1/cover@2x.png"
tags: chatgpt custom-gpt
youtube_id: "4L8UkfQiY0w"
---

**The idea**: Employ a customized GPT to handle genuinely useful tasks for me.

**The goal**: Imagine booking a car for tomorrow morning without lifting a finger, all while keeping my eyes on the TV and enjoying a football game on the sofa.

**The actual use case**: Typically, I book the same few cars, always opting for those nearest to my home. There's a routine: if the closest carsharing spot (about 100 meters away) is out, I check the next one (200 meters away), and so on. The quest continues until I find a vehicle within a reasonable walking distance. Usually, it's just for a short stint—maybe an hour or two.

**The annoyance**:
It's a repetitive drill. I power up the laptop, navigate to the carsharing site, input the date and time, hunt for the usual car (cheapest and closest, obviously), and book it—only to then go back to whatever I was doing before. 📺

**The context**: In Freiburg, Germany, I have access to two carsharing providers, each utilizing an (unofficial) API through their web and mobile apps.

### Steps to Accomplish This Feat:
1. **Inspect the API**: Understand how authentication works and scrutinize the specific requests needed to find and book cars for selected dates and times.
2. **Craft an API Wrapper**: Simplify interaction with the API by building a wrapper for debugging and easier request management. This limits how much the GPT needs to know, reducing potential errors.
3. **Configure the Custom GPT**: Equip it with precise instructions and integrate several endpoints using the OpenAPI YAML specification.
4. **Run the API Wrapper as a Daemon**: Host it on a publicly available web server to keep it accessible and operational.
5. **Make Booking a Joy**: Simplify and streamline the process. 🚗

Ready to get started? Grab the code and dive in with me:<br>
<a href="https://github.com/MaxAIPlayground/gpt-carsharing-agent" title="MaxAIPlayground/gpt-carsharing-agent" target="_blank">github.com/MaxAIPlayground/gpt-carsharing-agent</a>

## Step 1: Inspect the Third-Party API

Base URL for all API Calls:
`https://de1.cantamen.de/casirest/v3/`

### Authentication
First up, let's figure out the authentication scheme. All requests to this API need an X-API-Key in the header:

![X-API-Key](/images/custom-gpt-ep1/x-api-key.png){:.max-w-sm.lg:max-w-xl}

A bit of detective work revealed that this key is actually revealed in the JavaScript app payload:

![X-API-Key](/images/custom-gpt-ep1/x-api-key-js.png)

This key can change, but for now, I'll just manually update it when needed. Ideally, we could automate the extraction of this X-API-Key, but for this walkthrough, I'm going to hardcode it into our API wrapper (details below).

**Quick note**: You might have noticed different keys in my screenshots — they were taken days apart, so no mix-up there! 😉

Alright, moving onto actual authentication. The app sends a POST request to the tokens endpoint, using expand=customerId as a query parameter. Here's how the payload looks, using my email and password, along with a provId—for our example, that's the "Grüne Flotte" Carsharing provider:

![Login](/images/custom-gpt-ep1/login-post-tokens-request.png){:.max-w-sm.lg:max-w-2xl}

If successful, the response includes a unique token and our personal customerId (which, by the way, is different from the user-facing customer number). Here's what we get back:

![Login](/images/custom-gpt-ep1/login-post-tokens-response.png){:.max-w-sm.lg:max-w-2xl}

The timeout timestamp appears to be a mechanism to discard the token on the backend if it isn't used soon after being issued.

Through some experimentation, I discovered we must use a Basic Header authorization with the token as the username and the customerId as the password.

In POSTMAN, it looks like this:

![Basic Authorization in POSTMAN](/images/custom-gpt-ep1/authorization-header-postman.png){:.max-w-sm.lg:max-w-lg}

This authorization header is then used for all subsequent API requests.

To generate the authorization header, we simply Base64 encode the username:password and prepend Basic to it:

![Basic Authorization header](/images/custom-gpt-ep1/authorization-header.png){:.max-w-sm.lg:max-w-xl}

**Another side note**: We can't use Open Authorization 2.0 (OAuth2) since there's no official support for it in the third-party API. However, crafting our own OAuth wrapper could be a workaround, enabling anyone using our GPT to leverage these capabilities. If you're interested in this feature, just ping me and I'll consider creating a tutorial just on that.

Now that we're authorized, let's delve into how to utilize the API effectively.

### Retrieve a List of All Available Cars Within a Certain Range
Initially, we hit the `pointsofinterest` endpoint, which fetches a list of all available cars.

![Retrieve a list of all available cars](/images/custom-gpt-ep1/pointsofinterest-request.png){:.max-w-sm.lg:max-w-xl}

Here's what the API responds with — a comprehensive list of carsharing spots and the cars (referred to as `bookees`) available at each location.

![Retrieve a list of all available cars](/images/custom-gpt-ep1/pointsofinterest-response.png){:.max-w-sm.lg:max-w-2xl}

Take a look at what a single `bookee` entry looks like. I've marked the crucial details: `id`, `licenseNumber`, and `bookeeType`.

![bookee entry](/images/custom-gpt-ep1/bookee.png)

We'll keep the `bookee ID` in mind — it's key for later when we actually reserve a car.

With the roster of locations and vehicles in hand, our next move is to check for availability based on a specific date and time.

### Request Availabilities for a Given Date and Time

This is handled through the `bookingproposals` endpoint, tailored for this purpose.

![bookee entry](/images/custom-gpt-ep1/bookingproposals.png){:.max-w-sm.lg:max-w-xl}

The app calculates the `lat` and `lng` coordinates by taking an address input in the location search bar:
![bookee entry](/images/custom-gpt-ep1/location-lat-lng.png){:.max-w-sm}

These coordinates then anchor the URL, guiding most requests to scout for nearby cars. It's smart because the response from our earlier call to the `pointsofinterest` endpoint uses these exact coordinates to determine the distance to the nearest available carsharing locations.

![bookee entry](/images/custom-gpt-ep1/distance-property.png){:.max-w-sm.lg:max-w-xl}

Armed with a list of cars sorted by proximity, let's dive into how the app locks in a reservation for a particular car on a chosen date and time.

### Retrieve a Reservation ID
After pinpointing our desired car within a 10,000-meter radius using the "bookeeId" and setting the time and date, we send a POST request to the `prelimbookings` endpoint. This crucial step fetches us a "reservation ID," a key piece needed for the next phase.

![prelimbookings request](/images/custom-gpt-ep1/prelimbookings-request.png){:.max-w-sm.lg:max-w-xl}

The response contains the ID we're looking for:

![prelimbookings request](/images/custom-gpt-ep1/prelimbookings-response.png){:.max-w-sm.lg:max-w-xl}

### Book the Car via the Reservation ID
With the reservation ID in hand, we make another POST request — this time to `prelimbookings/${reservationId}/confirm`. This action solidifies our booking and provides a booking ID, which could be useful for any necessary cancellations later on.

![prelimbookings request](/images/custom-gpt-ep1/prelimbookings-confirm-request.png){:.max-w-sm.lg:max-w-xl}

The response confirms our successful booking with the booking ID:

![prelimbookings request](/images/custom-gpt-ep1/prelimbookings-confirm-response.png){:.max-w-sm.lg:max-w-xl}

Having navigated through the necessary API calls, we're now set to construct a straightforward wrapper to simplify these interactions for our GPT.

## Step 2: Create the Node.js API Wrapper
We'll spin up a simple express server to serve as the gateway for our custom GPT actions. ChatGPT will hit these endpoints, and our job is to relay these requests to the third-party API. In some cases, we'll also refine the response based on specific logic — better we handle this part to ensure precision and avoid any less-than-ideal outcomes from ChatGPT.

For instance, our GPT should deliver a list of 5 cars that meet these criteria:
- Proximity to our home address
- Cost-effectiveness for bookings exceeding 3 hours, where a longer walk to a slightly farther car could mean saving a few euros

**Bonus**: The GPT will also weigh the proximity of the car against its hourly cost. Here are the hourly rates for different car sizes:
- XS = **€1,60/hr**
- S = **€2,10/hr**
- M = **€2,70/hr**
- L = **€3,40/hr**
- XL = **€4,00/hr**

For example, if a Type S car is within 200 meters, we'll book it — even if a smaller, cheaper Type XS is a bit further out. This selective preference ensures we strike the right balance between cost and convenience.

Here's how we set up this decision-making process (cheers, ChatGPT! 😆):
```js
// Define priority map and cutoff distances
const priorityMap = { 'XS': 1, 'S': 2, 'M': 3, 'M (Elektro)': 3, 'L': 4, 'XL': 5 };

const distanceForConvenienceCutOff = 200;

// Adjust selection based on booking duration
if (bookingDurationHours < 3) {
    // Prefer nearest cars if the booking is for less than 3 hours, with special consideration for 'S' within 200m
    cars.sort((a, b) => {
        const typeA = priorityMap[a.bookeeType.name];
        const typeB = priorityMap[b.bookeeType.name];
        const distDiff = a.distance - b.distance;

        // Check for 'XS' vs 'S' special condition
        if ((typeA === 1 && typeB === 2) || (typeA === 2 && typeB === 1)) {
            // Prefer 'S' within 200m over 'XS' beyond 200m
            if (typeA === 2 && a.distance <= distanceForConvenienceCutOff && b.distance > distanceForConvenienceCutOff) return -1;

            // Prefer 'S' within 200m over 'XS' beyond 200m
            if (typeB === 2 && b.distance <= distanceForConvenienceCutOff && a.distance > distanceForConvenienceCutOff) return 1;
        }

        // Prioritize 'XS' cars explicitly when they compete with any other type
        if (typeA === 1 || typeB === 1) {
            if (typeA === 1 && typeB !== 1) return -1; // Always prioritize 'XS' over others unless above condition met
            if (typeB === 1 && typeA !== 1) return 1;  // Always prioritize 'XS' over others unless above condition met
        }

        // Compare types if both are 'XS' or 'S'
        if (typeA <= 2 && typeB <= 2) {
            return distDiff;  // Prefer closer car if both are 'XS' or 'S'
        }

        // General case: sort by type then by distance
        if (typeA !== typeB) return typeA - typeB;
        return distDiff;
    });
} else {
    // For longer bookings, prioritize cost over proximity
    cars.sort((a, b) => {
        const typeA = priorityMap[a.bookeeType.name];
        const typeB = priorityMap[b.bookeeType.name];
        return typeA - typeB;
    });
}
```

Here you can see all the endpoints that we'll expose to our GPT:
[gpt-serve.js](https://github.com/MaxAIPlayground/gpt-carsharing-agent/blob/main/gpt-serve.js)

## Step 3: Create the Custom GPT

Besides the name and description, we'll want to enable the `Web Browsing` and `Code Interpreter` plugins.

![Basic custom GPT settings](/images/custom-gpt-ep1/create-gpt-basic.png)
Since we're using this GPT for our own private purposes, we can make use of a conversation starter that contains our home address. If needed, we could extend this with different addresses for various use cases.

![Basic custom GPT settings](/images/custom-gpt-ep1/conversation-starter.png)

Now, let's have a closer look at our instructions:
```
You are a GPT that enables a user to easily find nearby rides from a carsharing provider in a certain area of Germany. Your only job is to look up available rides, reserve them and finally, book a specific ride. A user can also list currently booked rides. If a user asks a question that has nothing to do with booking or cancelling a ride, don't even try to come up with an answer. Just politely ask the user whether he wants to look up a ride for a certain time.

You will follow these steps, in order:

1. Ask the user to state a "base" address which is used as a lookup for available nearby rides. This can be either a physical address or lat/long coordinates. Remember this address once given by the user. It serves as his base address from which he's looking for cars that are close to him. Only ever change this address if the user asks to change it.

2. If not already specified, always ask for the date and time for which the user wants to book a ride. A typical user input will be: "today between 7pm and 9pm" or "tomorrow between  8am and 6pm".  Do not continue to step 3 unless you have this required information (address + date/time). Always assume the actual current day if the user refers to "today". Look it up if necessary! If a user states only the day and month and no year, always assume the current year (2024).

3. Call cars to get a list of available cars for the given time frame. Use the required "lat", "lng", "start" and "end" parameters for this request.

4. If the user wants to make a reservation, call reservation to create a reservation. Use the required "start", "end" and "bookeeId" parameters for this request.

5. IF USER CONFIRMS: Call book to finalize the booking.

When passing "start" and "end" parameters to actions, make sure the format is UTC. However the time range the user gives is always the timezone Europe/Berlin.
When a user cancels a booking, first get a cancellation id via the cancel action. With this returned cancellation id, ask the user for confirmation of the cancellation. Upon confirmation of the user, call cancel-confirm. This will completely cancel the booking.

If you ask a question of the user, never answer it yourself. You may suggest answers, but you must have the user confirm.

Example conversation:
ChatGPT: Which address should I use as a base?
User: Klarastr. 55, 79106 Freiburg, Germany

ChatGPT: For which time do you want me to find nearby cars?
User: today between 7 and 9pm

ChatGPT: Here are the closest cars I found:
1) Hauptbahnhof/Wentzingerstr. (name), Toyota Aygo X (displayName), EM-SW 1710 (licenseNumber), "XS" (bookeeType.name), 231m Entfernung (distance)
2) Hauptbahnhof/Wentzingerstr. (name), Ford Fiesta (displayName), EM-SW 4020 (licenseNumber), "S" (bookeeType.name), 231m Entfernung (distance)
3) Wannerstr. 4 (name), MG 5 (displayName), EM-SW 4079 (licenseNumber), "M (Elektro)" (bookeeType.name), 385m Entfernung (distance)
4) ...
5) ...
User: Make a reservation for option 1)

ChatGPT: I made a reservation for Hauptbahnhof/Wentzingerstr. (name), Toyota Aygo X (displayName), EM-SW 1710 (licenseNumber), "XS" (bookeeType.name) for today between 22 and 23pm. Do you want me to proceed with the booking?
User: Yes

ChatGPT: OK, the booking is complete for today, 22pm - 23pm.  Details: Hauptbahnhof/Wentzingerstr. (name), Toyota Aygo X (displayName), EM-SW 1710 (licenseNumber), "XS" (bookeeType.name)
User: no reply expected
```
I make it clear to the GPT that it should always assume the current date when we mention "today". This is important because I once had a mix-up where the GPT defaulted to 2023, leaving me puzzled about the unavailability of cars. 😅

Here's how I make sure the GPT is on the right track:
```yaml
openapi: 3.0.0
info:
  title: Carsharing API Authentication
  version: 1.0.0
servers:
  - url: <YOUR_API_HOST>
paths:
  /gpt-carsharing-agent/auth:
    get:
      summary: Retreive the customerId and unique authentication id
      description: Authenticates the user in case we get unauthorized responses from our carsharing endpoints
      operationId: Basic Authentication
      responses:
        "200":
          description: Token created or retrieved successfully.
          content:
            application/json:
              schema:
                type: object
                properties:
                  token:
                    type: string
                    description: The access token generated or retrieved.
                  id:
                    type: string
                    description: Unique identifier for the token.
                  timeout:
                    type: string
                    format: date-time
                    description: Time when the token will no longer be valid for operations that could be completed earlier.
                  expiry:
                    type: string
                    format: date-time
                    description: Expiration time of the token.
                  customerId:
                    type: string
                    description: Customer ID associated with the token.
        "400":
          description: Invalid request parameters or missing required fields.
        "401":
          description: Authentication failed due to invalid credentials.
      security:
        - ApiKeyAuth: []
  /gpt-carsharing-agent/cars:
    get:
      summary: Retrieve a list of available cars
      operationId: cars
      description: Retrieves a complete list of all cars no matter whether they're available for the given start/end dates.
      parameters:
        - in: query
          name: lat
          required: true
          schema:
            type: string
          description: Latitude coordinate of the user's base starting point.
          default: 47.9969
        - in: query
          name: lng
          required: true
          schema:
            type: string
          description: Longitude coordinate of the user's base starting point.
          default: 7.8398
        - in: query
          name: range
          schema:
            type: string
          description: Range in meters that is used as a radius to look for cars. Use default is not specified otherwise.
          default: 1000
        - in: query
          name: start
          required: true
          schema:
            type: string
            format: date-time
            description: Start time in ISO 8601 UTC format.
          example: 2024-04-12T19:00:00Z
        - in: query
          name: end
          required: true
          schema:
            type: string
            format: date-time
            description: End time in ISO 8601 UTC format.
          example: 2024-04-12T120:00:00Z
      responses:
        "200":
          description: A list of points of interest including places and cars.
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: "#/components/schemas/Car"
  /gpt-carsharing-agent/reservation:
    get:
      summary: Make a specific reservation for a car
      operationId: reservation
      description: Makes a reservation for a specific car and start/end date-time
      parameters:
        - in: query
          name: start
          required: true
          schema:
            type: string
            format: date-time
            description: Start time in ISO 8601 UTC format.
          example: 2024-04-12T19:00:00Z
        - in: query
          name: end
          required: true
          example: 2024-04-12T120:00:00Z
          schema:
            type: string
            format: date-time
            description: End time in ISO 8601 UTC format.
        - in: query
          name: bookeeId
          required: true
          example: 20229
          schema:
            type: string
            description: The id of the car to reserve
      responses:
        "200":
          description: An object containing a unique reservation id to confirm the reservation
          content:
            application/json:
              schema:
                type: object
                $ref: "#/components/schemas/Reservation"
        "400":
          description: The reservation can't be made because it's not available any longer
  /gpt-carsharing-agent/book:
    get:
      summary: Create a booking for a reservation id
      operationId: book
      description: Creates a booking for a specific car given a reservation id (from /reservation endpoint)
      parameters:
        - in: query
          name: reservationId
          required: true
          schema:
            type: string
            description: The unique reservation id to make a booking for
          example: 9Fx92r3GUugBWUKhFsvHgIV5d3i3pxq6JFniw8-3YEud
      responses:
        "200":
          description: An object containing a unique booking id to confirm the booking
          content:
            application/json:
              schema:
                type: object
                $ref: "#/components/schemas/Booking"
        "400":
          description: The booking can't be made for whatever reason (probably incorrect reservation id)
  /gpt-carsharing-agent/bookings:
    get:
      summary: List all current bookings
      operationId: listbookings
      description: Lists all current bookings
      responses:
        "200":
          description: An object containing the bookings
          content:
            application/json:
              schema:
                type: object
                $ref: "#/components/schemas/BookingListItem"
  /gpt-carsharing-agent/cancel:
    get:
      summary: Cancel a specific booking
      operationId: cancel
      description: Cancel a specific  booking
      parameters:
        - in: query
          name: bookingId
          required: true
          schema:
            type: string
            description: The unique booking id
          example: 131_1995963
      responses:
        "200":
          description: Success
  /gpt-carsharing-agent/cancel-confirm:
    get:
      summary: Confirm the cancellation of a specific booking
      operationId: cancelconfirm
      description: Confirm the cancellation of a specific booking
      parameters:
        - in: query
          name: cancellationId
          required: true
          schema:
            type: string
            description: The cancellation id
          example: ZupLy2uA8FNPZKGIJmH9vD5Kez1ca3K1pmkIpEM4qDfs
      responses:
        "200":
          description: An object containing the cancellation confirmation
          content:
            application/json:
              schema:
                type: object
                $ref: "#/components/schemas/CancellationConfirmation"
components:
  schemas:
    Car:
      type: object
      properties:
        id:
          type: string
        geoCoordinate:
          $ref: "#/components/schemas/GeoCoordinate"
        places:
          type: array
          items:
            $ref: "#/components/schemas/Place"
    GeoCoordinate:
      type: object
      properties:
        latitude:
          type: number
          format: double
        longitude:
          type: number
          format: double
    TimeRange:
      type: object
      properties:
        start:
          type: string
          format: date-time
          description: Time when the token will no longer be valid for operations that could be completed earlier.
        end:
          type: string
          format: date-time
          description: Time when the token will no longer be valid for operations that could be completed earlier.
    Place:
      type: object
      properties:
        id:
          type: string
        provId:
          type: string
        name:
          type: string
        geoCoordinate:
          $ref: "#/components/schemas/GeoCoordinate"
        isFixed:
          type: boolean
        bookees:
          type: array
          items:
            $ref: "#/components/schemas/Bookee"
        address:
          $ref: "#/components/schemas/Address"
        poolElementCount:
          type: integer
        distance:
          type: number
          format: double
    Bookee:
      type: object
      properties:
        id:
          type: string
        provId:
          type: string
        name:
          type: string
        isPool:
          type: boolean
        displayName:
          type: string
        locality:
          type: string
        slotBased:
          type: boolean
        fuelLevel:
          type: number
        isElectroMobile:
          type: boolean
        licenseNumber:
          type: string
        bookeeType:
          $ref: "#/components/schemas/BookeeType"
        useMode:
          type: string
        returnLocation:
          type: string
        instantAccess:
          type: boolean
        advanceBooking:
          type: boolean
        openEnd:
          type: boolean
        bookableOnPremises:
          type: boolean
        bookableRemote:
          type: boolean
        poolElementCount:
          type: integer
    BookeeType:
      type: object
      properties:
        id:
          type: string
        provId:
          type: string
        name:
          type: string
    Address:
      type: object
      properties:
        street:
          type: string
        streetNr:
          type: string
        postalCode:
          type: string
        city:
          type: string
        country:
          type: string
    Reservation:
      type: object
      properties:
        id:
          type: string
          description: The unique reservation id that is used to confirm a reservation
        timeRange:
          $ref: "#/components/schemas/TimeRange"
        bookeeId:
          type: string
          description: The id of the car in question
    Booking:
      type: object
      properties:
        id:
          type: string
          description: The booking id
        timeRange:
          $ref: "#/components/schemas/TimeRange"
    BookingListItem:
      type: object
      properties:
        id:
          type: string
          description: The booking id
        timeRange:
          $ref: "#/components/schemas/TimeRange"
        bookeeId:
          type: string
          example: B131_1945963
    CancellationConfirmation:
      type: object
      properties:
        id:
          type: string
          description: The booking that was cancelled
        timeRange:
          $ref: "#/components/schemas/TimeRange"
        cancelled:
          type: boolean
          description: Whether the booking was indeed cancelled or not
  securitySchemes:
    BasicAuth:
      type: http
      scheme: basic
```

I refer directly to endpoints defined in my action. This structure nearly eliminates the chance for GPT to make errors or construct invalid requests. We use a detailed OpenAPI specification so our GPT knows exactly how to handle the requests needed. Check out the parsed schema actions after loading them into the GPT editor:

![Custom GPT actions](/images/custom-gpt-ep1/available-actions.png)

## Step 4: Launch the API Wrapper
Ready to get this wrapper up and running? First, clone the repo from <a href="https://github.com/MaxAIPlayground/gpt-carsharing-agent" title="github.com/MaxAIPlayground/gpt-carsharing-agent" target="_blank">repo</a>. Next, run `npm install` to get the necessary packages. Don't forget to set up your `.env` with your credentials and a designated port. Kick things off with `node gpt-serve.js`. To ensure everything operates smoothly in the background, I opt for supervisord. Here's an example configuration:
```
[program:my-gpt-daemon]
directory=/home/user/gpt/gpt-serve.js
command=node gpt-serve.js
autostart=true
autorestart=true
environment=NODE_ENV=production
```
Keep an eye on the `error.log` to catch any potential issues early. It's also a great tool for debugging the API requests your GPT is making — definitely handy for ensuring things are running as expected.

## Step 5: Demo Time

Now for the fun part — let's see our custom GPT in action! We kick off with our preset home address as the conversation starter:

![Conversation Starter](/images/custom-gpt-ep1/demo-conversation-starter.png){:.max-w-xs.mx-auto}

<br>
After feeding the GPT a specific time and date, it quickly sifts through the data and presents the top 5 available cars:
<div class="xs:flex justify-center">
    <img class="mx-auto xs:mx-1 xs:w-1/2 xs:max-w-72 !mt-0" src="/images/custom-gpt-ep1/demo-time-location.png">
    <img class="mx-auto xs:mx-1 xs:w-1/2 xs:max-w-72 !mt-0" src="/images/custom-gpt-ep1/demo-cars-result.png">
</div>

Because I'm lazy, I opt for Option 3 – the closest and most affordable option, a Type XS car. Let's confirm the booking:
<div class="xs:flex justify-center">
    <img class="mx-auto xs:mx-1 xs:w-1/2 xs:max-w-72 !mt-0" src="/images/custom-gpt-ep1/demo-option-3.png">
    <img class="mx-auto xs:mx-1 xs:w-1/2 xs:max-w-72 !mt-0" src="/images/custom-gpt-ep1/demo-final-booking.png">
</div>

And there you have it. This GPT setup not only saves time but also makes car rental a hassle-free experience. 🚗

## Taking It further

### Make the Custom GPT Public (Implement an OAuth2 Wrapper)
Given how useful this custom GPT could be for other ChatGPT enthusiasts, it's worth considering making it public. Since we're handling an unofficial API, implementing our own OAuth2 wrapper would be essential. This setup would allow users to authenticate using their own credentials without needing a node.js server. Basically, we'd configure OAuth2 with a custom redirect URL to manage authentication smoothly.

**Side note**: Here's how you'd set up OAuth2 authentication for a custom GPT:

![Custom GPT Oauth Setting](/images/custom-gpt-ep1/oauth-setting.png){:.max-w-xs}

A closer look at the OAuth settings:

![Custom GPT Oauth Setting Details](/images/custom-gpt-ep1/oauth-setting-details.png){:.max-w-sm}

The `Client Secret` safeguards your app's credentials, while the `Client ID` uniquely identifies it. This distinction ensures that only authorized users can interact with the authorization server, maintaining security and access control.

Typically, the Authorization URL initiates a login screen for the user. Upon successful login, the Token URL is called, issuing an `access_token`:
```json
{
  "access_token":"a3B8F71c2E9d44f3B6e0B8cA47e9D7b156cEe40B8bDeB",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "a9R7tG5y2S0p1F8s3D7k6L0j9H2z1X0c1M5b6N3",
  "scope": "create"
}
```

This `access_token` enables our GPT to authenticate subsequent requests, providing access to the 3rd party API on a per-user basis. Quite nifty, right? This makes it possible for our GPT to interact with APIs that require individual user authentication.

Interested in seeing this in action? If you'd like a demo or more details on setting up an OAuth wrapper for this type of use case, shoot me an <a href="mailto:{{ site.email }}" title="Send me an email">email</a>. I'm eager to expand on this if there's enough interest.

### Extend a Current Booking While Busy Driving
Here's another scenario: you're rushing to return the car and realize too late that you should've booked it for longer. Rather than fumbling with the app while driving, why not just tell the GPT to extend the booking using voice commands? This feature could save you from a lot of stress and hassle, especially if the current reservation allows for an extension.

### Connect Multiple Carsharing Providers for Parallel Lookups
Since I juggle between two different carsharing services, merging these searches would be super beneficial. It would streamline the process, offering a one-stop solution for checking availability across multiple providers simultaneously.

All the source code is available on GitHub. Check it out at:
<a href="https://github.com/MaxAIPlayground/gpt-carsharing-agent" target="_blank">MaxAIPlayground/gpt-carsharing-agent</a>

#### Tools Used
- ChatGPT 4 (requires a Plus subscription)
- Custom GPT + actions
- OpenAPI
- node.js (Express)
- supervisord
- Postman
