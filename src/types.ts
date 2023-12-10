import {
  nat64,
  Vec,
  Opt,
  Record
} from "azle";

//   export type ClientId = string;
//   export type LawyerId = string;
//   export type CaseId = string;
//   export type WitnessId = string;

export type Client = Record<{
  id: string,
  Name: string,
  Surname: string,
  Phonenumber: string,
  Email: string,
  Gender: string,
  Date_Of_Birth: nat64,
  Occupation: string,
  Marital_Status: string,
  Nationality: string,
  datJoined: nat64,
}>;

export type ClientPayload = Record<{
  Name: string,
  Surname: string,
  Phonenumber: string,
  Email: string,
  Gender: string,
  Occupation: string,
  Marital_Status: string,
  Nationality: string,
}>;

export type Lawyer = Record<{
  id: string,
  Title: string,
  Name: string,
  Surname: string,
  Phonenumber: string,
  Email: string,
  Case_Category: string,
  Case_Won: nat64,
  Case_Lost: nat64,
  Experience: string,
  Nationality: string,
  createdAt: nat64,
}>;

export type LawyerPayload = Record<{
  Title: string,
  Name: string,
  Surname: string,
  Phonenumber: string,
  Email: string,
  Case_Category: string,
  Experience: string,
  Nationality: string,
}>;

export type Case = Record<{
  id: string,
  Case_name: string,
  CreatedAt: nat64,
  UpdatedAt: Opt<nat64>,
  Description: string,
  Documents: Vec<string>,
  Timeline: string,
  State: string,
  LawyerId: string,
  ClientId: string,
  WitnessIds: Opt<Vec<string>>,
}>;

export type CasePayload = Record<{
  Case_name: string,
  Description: string,
  Documents: Vec<string>,
  Timeline: string,
}>;

export type Witness = Record<{
  id: string,
  Fullname: string,
  national_id: string,
  Testimony: string,
}>;

export type WitnessPayload = Record<{
  Fullname: string,
  national_id: string,
  Testimony: string,
}>;
