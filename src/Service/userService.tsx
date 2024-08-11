import axios from "axios";
import { userGetResspones } from "../model/userGetRespons";
const HOST: string = "http://localhost:3000/user";

export class ServiceUser {
    async getAllUesr() {
      const response = await axios.get(HOST);
      const papers: userGetResspones[] = response.data;
      return papers;
    }
    async getUesrByEmail(email:string) {
        const response = await axios.get(HOST+"/"+email);
        const papers = response.data;
        return papers;
      }
    //loginUser
    async getLogin(body: { email: String; password: String }) {
      const response = await axios.post(HOST + "/login", body);
      return response;
    }

    async addUser(body: { email: String; password: String;name: String }) {
        const response = await axios.post(HOST + "/", body);
        return response;
      }
  }
  