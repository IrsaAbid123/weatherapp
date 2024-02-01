import axios from 'axios';
import { apiKey } from '../constants';

const forcastEndPoint = (params : any) => `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${params.cityName}&days=${params.days}&aqi=no&alerts=no`
const searchEndPoint = (params : any) => `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${params.cityName}`

const apiCall = async (endpoint: any) => {
    const options ={
      method: 'GET',
      url: endpoint
    }
    try{
      const response = await axios.request(options)
      return response.data
    }catch(err){
        console.log(err)
        return null
    }
}

export const fetchWeatherForcast = (params: any) => {
    return apiCall(forcastEndPoint(params))
}

export const fetchLocation = (params: any) =>{
    return apiCall(searchEndPoint(params))
}

