import axios from "axios";
import {BoardMemberGetResspones} from "../model/boardMemGetRespons";
import {BoardMemuserGetRespons} from "../model/boardMemuserGetRespons";

const HOST: string = "http://localhost:3000/board_member/";

export class ServiceBoardMemn {
    
    async getAllBoardById(Fid: number) {
        const response = await axios.get(HOST + `board/${Fid}`);
      const papers: BoardMemberGetResspones[] = response.data;
      return papers;
    }
    
    async getAllUserById(Fid: number) {
        const response = await axios.get(HOST + `user/${Fid}`);
      const papers: BoardMemuserGetRespons[] = response.data;
      return papers;
    }

    async addUser(body: { board_id: Number; user_id: Number;}) {
        const response = await axios.post(HOST + "/", body);
        return response;
      }
  }