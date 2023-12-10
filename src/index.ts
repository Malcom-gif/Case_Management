import {
    $query,
    $update,
    StableBTreeMap,
    Vec,
    ic,
    Opt,
    match,
    Result,
  } from "azle";
  import { v4 as uuidv4 } from "uuid";
  
  import {
    Client,
    ClientPayload,
    Lawyer,
    LawyerPayload,
    Case,
    CasePayload,
    Witness,
    WitnessPayload,
  } from "./types";
  
  const Clients = new StableBTreeMap<string, Client>(0, 44, 1024);
  const Lawyers = new StableBTreeMap<string, Lawyer>(1, 44, 1024);
  const Cases = new StableBTreeMap<string, Case>(2, 44, 1024);
  const Witnesses = new StableBTreeMap<string, Witness>(3, 44, 1024);
  const ClientCase = new StableBTreeMap<string, Vec<string>>(4, 44, 1024);
  
  
  // Add client to the system
  $update
  export function addClient(payload: ClientPayload): Result<Client, string> {
    try {
      // Validate payload properties
      if (
        !payload.Name ||
        !payload.Surname ||
        !payload.Phonenumber ||
        !payload.Email ||
        typeof payload.Name !== "string" ||
        typeof payload.Surname !== "string" ||
        typeof payload.Phonenumber !== "string" ||
        typeof payload.Email !== "string"
      ) {
        throw new Error("Invalid payload");
      }
  
      // Set each payload property individually
      const client: Client = {
        id: uuidv4(),
        Name: payload.Name,
        Surname: payload.Surname,
        Phonenumber: payload.Phonenumber,
        Email: payload.Email,
        Gender: payload.Gender,
        Date_Of_Birth: ic.time(),
        Occupation: payload.Occupation,
        Marital_Status: payload.Marital_Status,
        Nationality: payload.Nationality,
        datJoined: ic.time(),
      };
      Clients.insert(client.id, client);
      return Result.Ok<Client, string>(client);
    } catch (error) {
      return Result.Err<Client, string>(`Error adding client: ${error}`);
    }
  }
  
  // Add a lawyer to the system
  $update
  export function addLawyer(payload: LawyerPayload): Result<Lawyer, string> {
    try {
      // Validate payload properties
      if (
        !payload.Title ||
        !payload.Name ||
        !payload.Surname ||
        !payload.Phonenumber ||
        !payload.Email ||
        !payload.Case_Category ||
        typeof payload.Title !== "string" ||
        typeof payload.Name !== "string" ||
        typeof payload.Surname !== "string" ||
        typeof payload.Phonenumber !== "string" ||
        typeof payload.Email !== "string" ||
        typeof payload.Case_Category !== "string"
      ) {
        throw new Error("Invalid payload");
      }
  
      // Set each payload property individually
      const lawyer: Lawyer = {
        id: uuidv4(),
        Title: payload.Title,
        Name: payload.Name,
        Surname: payload.Surname,
        Phonenumber: payload.Phonenumber,
        Email: payload.Email,
        Case_Category: payload.Case_Category,
        Case_Won: BigInt(0),
        Case_Lost: BigInt(0),
        Experience: payload.Experience,
        Nationality: payload.Nationality,
        createdAt: ic.time(),
      };
      Lawyers.insert(lawyer.id, lawyer);
      return Result.Ok<Lawyer, string>(lawyer);
    } catch (error) {
      return Result.Err<Lawyer, string>(`Error adding lawyer: ${error}`);
    }
  }
  
  // Add a case to the system
  $update
  export function addCase(payload: CasePayload): Result<Case, string> {
    try {
      // Validate payload properties
      if (
        !payload.Case_name ||
        !payload.Description ||
        !payload.Documents ||
        !payload.Timeline ||
        typeof payload.Case_name !== "string" ||
        typeof payload.Description !== "string" ||
        !Array.isArray(payload.Documents) ||
        !Array.isArray(payload.Timeline)
      ) {
        throw new Error("Invalid payload");
      }
  
      // Set each payload property individually
      let caseId = uuidv4();
      let caseData: Case = {
        id: caseId,
        Case_name: payload.Case_name,
        CreatedAt: ic.time(),
        UpdatedAt: Opt.None,
        Description: payload.Description,
        Documents: payload.Documents,
        Timeline: payload.Timeline,
        State: "Pending",
        LawyerId: '',
        ClientId: '',
        WitnessIds: Opt.None,
      };
      Cases.insert(caseId, caseData);
      return Result.Ok<Case, string>(caseData);
    } catch (error) {
      return Result.Err<Case, string>(`Error adding case: ${error}`);
    }
  }
  
  // Add a witness to the system
  $update
  export function addWitness(payload: WitnessPayload): Result<Witness, string> {
    try {
      // Validate payload properties
      if (
        !payload.Fullname ||
        !payload.national_id ||
        !payload.Testimony ||
        typeof payload.Fullname !== "string" ||
        typeof payload.national_id !== "string" ||
        typeof payload.Testimony !== "string"
      ) {
        throw new Error("Invalid payload");
      }
  
      // Set each payload property individually
      let witness: Witness = {
        id: uuidv4(),
        Fullname: payload.Fullname,
        national_id: payload.national_id,
        Testimony: payload.Testimony,
      };
      Witnesses.insert(witness.id, witness);
      return Result.Ok<Witness, string>(witness);
    } catch (error) {
      return Result.Err<Witness, string>(`Error adding witness: ${error}`);
    }
  }
  
  // Retrieve a client by ID
  $query
  export function getClient(id: string): Result<Client, string> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid ID");
      }
  
      const clientOpt = Clients.get(id);
      return match(clientOpt, {
        Some: (client) => Result.Ok<Client, string>(client),
        None: () => Result.Err<Client, string>(`The client with id=${id} was not found`),
      });
    } catch (error) {
      return Result.Err<Client, string>(`Error getting client: ${error}`);
    }
  }
  
  // Retrieve all clients
  $query
  export function getAllClients(): Result<Vec<Client>, string> {
    try {
      return Result.Ok<Vec<Client>, string>(Clients.values());
    } catch (error) {
      return Result.Err<Vec<Client>, string>(`Error getting clients: ${error}`);
    }
  }
  
  // Retrieve all cases
  $query
  export function getAllCases(): Result<Vec<Case>, string> {
    try {
      return Result.Ok<Vec<Case>, string>(Cases.values());
    } catch (error) {
      return Result.Err<Vec<Case>, string>(`Error getting cases: ${error}`);
    }
  }
  
  // Retrieve a case by ID
  $query
  export function getCase(id: string): Result<Case, string> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("Invalid ID");
      }
  
      const caseOpt = Cases.get(id);
      return match(caseOpt, {
        Some: (c) => Result.Ok<Case, string>(c),
        None: () => Result.Err<Case, string>("Case not found"),
      });
    } catch (error) {
      return Result.Err<Case, string>(`Error getting case: ${error}`);
    }
  }
  
  // Assign a lawyer to a case
  $update
  export function assignLawyerToCase(caseId: string, lawyerId: string): Result<Case, string> {
    try {
      if (!caseId || typeof caseId !== "string" || !lawyerId || typeof lawyerId !== "string") {
        throw new Error("Invalid IDs");
      }
  
      const caseDataOpt = Cases.get(caseId);
      return match(caseDataOpt, {
        Some: (caseData) => {
          const lawyerOpt = Lawyers.get(lawyerId);
          return match(lawyerOpt, {
            Some: (lawyer) => {
              const caseUpdated: Case = { ...caseData, LawyerId: lawyer.id };
              Cases.insert(caseData.id, caseUpdated);
              return Result.Ok<Case, string>(caseUpdated);
            },
            None: () => Result.Err<Case, string>('Failed to assign case to the lawyer'),
          });
        },
        None: () => Result.Err<Case, string>('Case does not exist'),
      });
    } catch (error) {
      return Result.Err<Case, string>(`Error assigning lawyer to case: ${error}`);
    }
  }
  
  // Update case state
  $update
  export function updateCaseState(caseId: string, newState: string): Result<Case, string> {
    try {
      if (!caseId || typeof caseId !== "string") {
        throw new Error("Invalid ID");
      }
  
      const caseDataOpt = Cases.get(caseId);
      return match(caseDataOpt, {
        Some: (caseData) => {
          const newCase: Case = { ...caseData, State: newState };
          Cases.insert(caseData.id, newCase);
          return Result.Ok<Case, string>(newCase);
        },
        None: () => Result.Err<Case, string>("Case does not exist"),
      });
    } catch (error) {
      return Result.Err<Case, string>(`Error updating case state: ${error}`);
    }
  }
  
  // Delete case by ID
  $update
  export function deleteCase(caseId: string): Result<Case, string> {
    try {
      if (!caseId || typeof caseId !== "string") {
        throw new Error("Invalid ID");
      }
  
      const deletedCase = Cases.remove(caseId);
      return match(deletedCase, {
        Some: (caseData) => Result.Ok<Case, string>(caseData),
        None: () => Result.Err<Case, string>("Case not found"),
      });
    } catch (error) {
      return Result.Err<Case, string>(`Error deleting case: ${error}`);
    }
  }
  
  // Workaround to make uuid package work with Azle
  globalThis.crypto = {
    //@ts-ignore
    getRandomValues: () => {
      let array = new Uint8Array(32);
  
      for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
      }
  
      return array;
    },
  };
  