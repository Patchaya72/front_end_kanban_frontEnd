import axios from "axios";
import {boardGetRespons} from "../model/boardGetRespons";
const HOST: string = "http://localhost:3000/board";

export class ServiceBoard {

    async getAllBoard() {
      const response = await axios.get(HOST);
      const papers: boardGetRespons[] = response.data;
      return papers;
    }

    async addBoard(body: { board_name: String; user_id: String; }) {
        const response = await axios.post(HOST + "/", body);
        return response;
      }
    
      async updateBoard( id:number | null,body: { board_name: String; }) {
        const response = await axios.put(HOST + "/"+id, body);
        return response;
      }
  }