import axios from "axios";
import { TaskAssingGetRespons } from "../model/task_AssingGetRespons";

const HOST: string = "http://localhost:3000/task_assignment/";

export class ServiceTaskAssing {
    
    async getAllTaskById(Fid: number) {
        const response = await axios.get(HOST + `assing/${Fid}`);
      const papers: TaskAssingGetRespons[] = response.data;
      return papers;
    }
    

    async addUser(body: { task_id: Number; user_id: Number;}) {
        const response = await axios.post(HOST + "/", body);
        return response;
      }
  }