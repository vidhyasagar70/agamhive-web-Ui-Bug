import { Country } from "./countrytypes";
import { State } from "./statetypes";

export interface City {
    _id: string;
    cityName: string;
    stateId: State;
    countryId: Country;
    status: "ACTIVE" | "INACTIVE"
  }
  
  export interface CityResponse {
    statusCode: number;
    msg: string;
    data: {
      data: City[] ;
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    };
  }
  
  export interface ApiResponse<T> {
    error?: string;
    data?: T;
  }
  