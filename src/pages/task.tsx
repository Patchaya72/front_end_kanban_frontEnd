import { useState, useEffect } from "react";
import {
  Button,
  Fab,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Card,
  CardActionArea,
  CardContent,
  Grid,
  Typography,
  Container,
} from "@mui/material";
import AppbarPage from "../component/appbar";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { ServiceTaskAssing } from "../Service/task_assignment";
import { TaskAssingGetRespons } from "../model/task_AssingGetRespons";
import axios from "axios";

function TaskPage() {
    
  const StorageTask = JSON.parse(localStorage.getItem("StorageTask")!);
  const board = JSON.parse(localStorage.getItem("board")!);
  const service = new ServiceTaskAssing();
  const navigate = useNavigate();
  const navigateTo = () => {
    navigate(-1);
  };

  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [tasks, setTask] = useState<TaskAssingGetRespons[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | number>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setSelectedUser("");
    setOpen(false);
  };

  useEffect(() => {
    // Fetch users from API
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/board_member/user/" + board.id
        );
        const data = await response.json();
        const res = await service.getAllTaskById(StorageTask.id);
        setTask(res);
        setUsers(data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleAddUser = async () => {
    // เรียก API เพื่อเพิ่มผู้ใช้ใหม่
    try {
      const body1 = {
        task_id: StorageTask.id,
        user_id: Number(selectedUser),
      };
      await service.addUser(body1);

      const body2 = {
        notification_text: "คุณได้ถูกเพิ่มใน Task:"+StorageTask.name+" ของBoard:"+board.name,
        is_read: 0,
        user_id: Number(selectedUser)
      };
         await axios.post(
        "http://localhost:3000/notification",body2
      );
      // setUsers(res);
      // console.log(res);
    } catch (error) {
      console.log(error);
    }
    setOpen(false);
    setSelectedUser("");
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
        <Button startIcon={<ArrowBackIosIcon />} onClick={navigateTo}>
          Back
        </Button>
        <h1>{StorageTask.name}</h1>
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
      <Container component="main" maxWidth="lg">
        <Box
          sx={{
            bgcolor: "#cfe8fc",
            width: "auto",
            height: "auto",
            py: 3,
            paddingRight: 10,
            paddingLeft: 10,
          }}
          justifyContent="center"
          alignItems="center"
        >
          {tasks.map((task, index) => (
            <Grid item xs={1} sm={6} md={4} key={`${task.name}-${index}`}>
              <Card sx={{ maxWidth: 345, position: "relative" }}>
                <CardActionArea>
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {task.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {task.assigned_date}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Box>
      </Container>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>เพิ่มผู้ใช้ลงใน Task</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <InputLabel id="select-user-label">User</InputLabel>
            <Select
              labelId="select-user-label"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
            >
              {users.map((data: any, index: number) => (
                <MenuItem key={index} value={data.user_id}>
                  {data.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ยกเลิก</Button>
          <Button onClick={handleAddUser}>ตกลง</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default TaskPage;
