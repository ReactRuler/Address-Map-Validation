# Map Polygon Address Validation
This repository contains code for drawing a polygon on a map using React and Leaflet. The polygon can be edited and deleted, and the map can be searched for a specific address. Additionally, the polygon data can be uploaded to an API for storage and retrieval. The code also includes a raycasting function to check if a given address is inside the polygon.

*<sub>This sample image depicts a polygon. We check if addresses fall within the blue zone, enabling targeted validation and exclusion of unwanted addresses, streets, and regions.</sub>*

![image](https://github.com/FlorinBoneta/Address-Map-Validation/assets/31567837/c00b531f-eb8e-40a9-b0fd-6f97a91e9d3d)



# Map polygon, web side:
## Features
* Drawing and editing polygons on a map
* Searching for addresses on the map
* Uploading and retrieving polygon data from an API
* Raycasting function to determine if an address is inside the polygon

## Technologies Used
* React: A JavaScript library for building user interfaces.
* Leaflet: An open-source JavaScript library for interactive maps.
* React Leaflet: A React wrapper for Leaflet, allowing you to use Leaflet maps in React applications.
* Leaflet.draw: A Leaflet plugin for drawing and editing shapes on the map.
* React Native: A JavaScript framework for building mobile applications using React.

## React Installation (Web)
To ensure the proper installation and usage of the mentioned dependencies and variables in a React website, you can follow these steps:
> 1. Install the required packages using npm or yarn. Open your project's terminal and run the following command:
```
npm install react-leaflet-draw leaflet leaflet-draw
```
> 2. Import the file **NewMap.js** to your project and then inside the file you want to use the map do this:
```
import NewMap from "./Path/To/NewMap";
```
> 3. Use the map on the desired page:
```
<NewMap />
```
> 4. Make sure to update the function **handleClick** as it is the one in charge to update the values to the online api so we can fetch it later.
```
async function handleClick() {
    try {
      const data = {
        polygon: mapLayers,
      };

      const response = await fetch(
        `HTTP://YOUR.API.URL`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer API_TOKEN}`,
          },
          body: JSON.stringify({ data }),
        }
      );

      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  }
  ```
  
## Usage
* Drawing a Polygon:
    * Click on the map to create vertices for the polygon.
    * Double-click to complete the polygon.
* Editing a Polygon:
    * Select the polygon on the map.
    * Drag the vertices to modify the shape of the polygon.
* Deleting a Polygon:
    * Select the polygon on the map.
    * Press the delete button to remove the polygon.
* Searching for an Address:
    * Enter an address in the search bar.
    * Press the search button.
    * The map will navigate to the location of the address.
* Uploading Polygon Data:
    * Click the "Update Map Layers" button to upload the polygon data to the API.
* Checking Address Inside Polygon:
    * Use the rayCasting function provided in the code.
    * Pass the address coordinates and the polygon coordinates to the function.
    * The function will return true if the address is inside the polygon, and false otherwise.
   
# Address Validation Component
## Features
* Validates an address by checking if it falls inside a specified polygon.
* Uses the React Native framework for building the user interface.
* Stores the validated address in the phone's storage using **AsyncStorage**.

# Installation
> 1. Make sure you have React Native set up in your development environment.
> 2. Copy the code and save it in a file named **MapValidate.js**.
> 3. Add the necessary dependencies to your project's **package.json** file:
   >  * **react-native**
   >  * **@react-native-async-storage/async-storage**

# Usage
> 1. Import the **MapValidate** component into your React Native application:
```
import MapValidate from './MapValidate';
```
> 2. Render the **MapValidate** component in your app's screen or component:
```
<MapValidate />
```
> 3. Customize the appearance of the component by modifying the **styles** object in the code.

# Explanation of Sections

## Importing Dependencies
The code begins by importing necessary components and modules from the **react-native** library, such as **View**, **Text**, **StyleSheet**, **TouchableOpacity**, **Dimensions**, and **TextInput**. It also imports the **React** module and the **AsyncStorage** module from **@react-native-async-storage/async-storage**.

## Utility Function: rayCasting
The **rayCasting** function is a utility function used to determine if a point is inside a polygon. It implements the ray-casting algorithm to perform this calculation.

## MapValidate Component Definition
The **MapValidate** component is defined as a functional component using the **const** keyword. It renders a view that includes an input field for entering an address, a button for validating the address, and a text component for displaying the validation result.

## State and Effects
The component uses the **useState** hook to manage the state of **validationResult**, **data**, **address**, and **point**. It also uses the **useEffect** hook to fetch data from an API when the component mounts.

## Handle Validation
The **handleValidate** function is called when the "Check address" button is pressed. It performs the validation process by making an API call to retrieve the coordinates of the entered address, checking if the coordinates fall inside the polygon using the **rayCasting** function, and updating the **validationResult** accordingly. If the address is inside the polygon, it is stored in the phone's storage using **AsyncStorage**.

## Rendering the Component
The **MapValidate** component is rendered within a **View** component, along with other components in the app's screen or component. The appearance of the component can be customized by modifying the **styles** defined in the styles object.

## Conclusion
The **MapValidate** component provides a simple way to validate addresses by checking if they fall inside a specified polygon. By following the installation and usage instructions, you can integrate this component into your React Native app and provide address validation functionality.

## Credits
This project uses various open-source libraries and resources:
* React: https://reactjs.org/
* Leaflet: https://leafletjs.com/
* React Leaflet: https://react-leaflet.js.org/
* Leaflet.draw: https://github.com/Leaflet/Leaflet.draw
* OpenStreetMap: https://www.openstreetmap.org/

## License
This project is licensed under the MIT License.

**Feel free to contribute to the project by submitting issues or pull requests.*






