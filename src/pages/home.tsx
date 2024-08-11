import { useEffect, useState } from "react";
import {
  Container,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Button,
  Fab,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import AppbarPage from "../component/appbar";
import EditIcon from "@mui/icons-material/Edit";
import { ServiceBoardMemn } from "../Service/boardMemnService";
import { ServiceBoard } from "../Service/boardService";
import { BoardMemberGetResspones } from "../model/boardMemGetRespons";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";

function HomePage() {
  const user_id = JSON.parse(localStorage.getItem("user_id")!);
  const service = new ServiceBoardMemn();
  const service2 = new ServiceBoard();

  const [boards, setBoards] = useState<BoardMemberGetResspones[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [newBoardName, setNewBoardName] = useState<string>("");
  const [editBoardId, setEditBoardId] = useState<number | null>(null);
  const navigate = useNavigate();

  function navigateToBoard(board_id:number,board_name:String){
    navigate(`/board`)
    localStorage.setItem("board", JSON.stringify({id:board_id,name:board_name}));
  }

  useEffect(() => {
    const getBoards = async () => {
      try {
        const data = await service.getAllBoardById(user_id);
        setBoards(data);
      } catch (err) {
        setError("Failed to load boards");
      } finally {
        setLoading(false);
      }
    };
    getBoards();
  }, [user_id]);

  const handleClickOpen = () => {
    setNewBoardName("");
    setEditBoardId(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddBoard = async () => {
    try {
      const body = {
        board_name: newBoardName,
        user_id,
      };
      await service2.addBoard(body);
      const data = await service.getAllBoardById(user_id);
      setBoards(data);
      handleClose();
    } catch (error) {
      console.error("Error adding board: ", error);
    }
  };

  const handleEditBoard = (board_id: number) => {
    setEditBoardId(board_id);
    const board = boards.find((board) => board.board_id === board_id);
    if (board) {
      setNewBoardName(board.board_name);
    }
    setOpen(true);
  };

  const handleUpdateBoard = async () => {
    try {
      const body = {
        board_name: newBoardName,
      };
      await service2.updateBoard(editBoardId,body);
      const data = await service.getAllBoardById(user_id);
      setBoards(data);
      handleClose();
    } catch (error) {
      console.error("Error updating board: ", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div>
        <AppbarPage />
      </div>
      <Container component="main" maxWidth="lg">
        <h1>Boards ของคุณ</h1>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Fab color="success" aria-label="add" onClick={handleClickOpen}>
            <AddIcon />
          </Fab>
        </Box>
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
          {boards && boards.length > 0 ? (
            <Grid
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 4, sm: 8, md: 12 }}
              justifyContent="center"
            >
              {boards.map((board) => (
                <Grid item xs={1} sm={6} md={4} key={board.board_id}>
                  <Card sx={{ maxWidth: 345, position: "relative" }}>
                    <CardActionArea
                      onClick={() => navigateToBoard(board.board_id,board.board_name)}
                    >
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                          {board.board_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          จำนวนคน {board.user_count}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    {board.user_id === user_id && (
                      <>
                        <IconButton  sx={{   position: "absolute", bottom: 8, right: 8  }} >
                          <DeleteIcon sx={{ fontSize: 20 }} />
                        </IconButton>
                      </>
                    )}
                    <IconButton
                            sx={{ position: "absolute", bottom: 8, right: 48}}
                          onClick={() => handleEditBoard(board.board_id)}
                        >
                          <EditIcon  />
                        </IconButton>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography variant="h6" align="center">
              คุณยังไม่มีบอร์ดในตอนนี้ มาสร้างกันเถอะ!!!
            </Typography>
          )}
        </Box>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {editBoardId ? "แก้ไขชื่อบอร์ด" : "เพิ่มบอร์ดใหม่"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {editBoardId
                ? "กรุณากรอกชื่อบอร์ดใหม่ที่ต้องการแก้ไข"
                : "กรุณากรอกชื่อบอร์ดใหม่ที่ต้องการเพิ่ม"}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="ชื่อบอร์ด"
              fullWidth
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button
              onClick={editBoardId ? handleUpdateBoard : handleAddBoard}
              color="primary"
            >
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}

export default HomePage;
