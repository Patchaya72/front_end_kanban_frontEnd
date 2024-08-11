import { Button, Fab, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Box } from "@mui/material";
import { useEffect, useState } from "react";
import AppbarPage from "../component/appbar";
import { useNavigate } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from "@mui/icons-material/Edit";
import { ServiceBoardMemn } from "../Service/boardMemnService";
import { ServiceUser } from "../Service/userService";
import { BoardMemuserGetRespons } from "../model/boardMemuserGetRespons";

function BoardsetPage() {
 const board=JSON.parse(localStorage.getItem("board")!)
 const service = new ServiceBoardMemn();
 const servicesUser = new ServiceUser();
  const navigate = useNavigate();
  const [users, setUsers] = useState<BoardMemuserGetRespons[]>([]);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");


useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await service.getAllUserById(board.id);
        setUsers(data);
      } catch (error) {
      }
    };
    fetchData();
  }, []);

  const handleAddUser = async () => {

    // เรียก API เพื่อเพิ่มผู้ใช้ใหม่
    try {
        const data = await servicesUser.getUesrByEmail(email);
        console.log(data[0].user_id);
        
        const body={
            board_id:board.id,
            user_id:data[0].user_id
        }
        console.log(body);
        
        await service.addUser(body);
        const res= await service.getAllUserById(board.id);
        setUsers(res);
        console.log(res);
        
    } catch (error) {
        console.log(error);
    }
      setOpen(false);
        setEmail("");
  };

  const navigateTo = () => {
    navigate(-1);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail("");
  };

  return (
    <>
      <div>
        <AppbarPage />
      </div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          paddingTop: 2,
          marginRight: 5,
        }}
      >
        <Button startIcon={<ArrowBackIosIcon />} onClick={navigateTo}>Back</Button>
        <h1>{board.name}</h1>
        <Box>
          <Fab color="warning" aria-label="edit" sx={{ marginLeft: 2 }}>
            <EditIcon />
          </Fab>
          <Fab
            color="success"
            aria-label="add"
            sx={{ marginLeft: 2 }}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </Fab>
          <Fab color="default" aria-label="setting" sx={{ marginLeft: 2 }}>
            <SettingsIcon />
          </Fab>
        </Box>
      </Box>

      <h1>Users</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.user_id}>
              <td>{user.name}</td>
              <td>{user.joined_date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleAddUser} color="primary">ตกลง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default BoardsetPage;
