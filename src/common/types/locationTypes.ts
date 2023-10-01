export interface StateType {
  id: string;
  name: string;
  code: string;
}

export interface CityType {
  id: string;
  name: string;
  stateId: string;
}

export interface ZoneType {
  id: string;
  number: number;
  cityId: string;
  City?: CityType;
}

export interface AddressType {
  id: string;
  address: string;
  location: string;
  Zone?: ZoneType;
  zoneId: string;
  lat: string;
  lng: string;
}

export interface SectionType {
  id: string;
  number: number;
  addressId: string;
}
