import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AppbarPage from "../component/appbar";
import { ColumnGetResspones, Task } from "../model/columnGeRespons";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Container } from "@mui/system";
import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  Typography,
} from "@mui/material";
const BoardPage: React.FC = () => {
  const [columns, setColumns] = useState<ColumnGetResspones[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskDialogMode, setTaskDialogMode] = useState<
    "add" | "edit" | "delete"
  >("add");
  const [newColumnName, setNewColumnName] = useState("");
  const [currentColumnId, setCurrentColumnId] = useState<number | null>(null);
  const [columnToDelete, setColumnToDelete] = useState<number | null>(null);
  const [newTaskName, setNewBoardName] = useState<string>("");
  const [taskToEdit, setTaskToEdit] = useState<number | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editMode, setEditMode] = useState(false); // Track which column is in edit mode
  const board = JSON.parse(localStorage.getItem("board")!);
  const Fid = board.id;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get<ColumnGetResspones[]>(
          "http://localhost:3000/column/" + Fid
        );
        setColumns(res.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const navigate = useNavigate();
  function navigateTo() {
    navigate(-1);
  }
  function navigateToBoardSetting() {
    navigate("/boardSet");
  }
  function navigateToTask(task_id:number,task_title:string) {
    localStorage.setItem("StorageTask", JSON.stringify({id:task_id,name:task_title}));
    navigate("/task");
    
  }

  const ItemType = "TASK";

  interface DragItem {
    task_id: number;
    column_id: number;
  }

  interface DropResult {
    column_id: number;
  }

  const useTaskDrag = (
    task: Task,
    column_id: number,
    moveTask: (task_id: number, column_id: number) => void
  ) => {
    const [, ref] = useDrag({
      type: ItemType,
      item: { task_id: task.task_id, column_id } as DragItem,
      end: (item, monitor) => {
        const dropResult = monitor.getDropResult<DropResult>();
        if (item && dropResult) {
          moveTask(item.task_id, dropResult.column_id);
        }
      },
    });
    return ref;
  };

  const TaskCard: React.FC<{
    task: Task;
    moveTask: (task_id: number, column_id: number) => void;
    column_id: number;
  }> = ({ task, moveTask, column_id }) => {
    const ref = useTaskDrag(task, column_id, moveTask);

    const handleEditClick = (task_id: number) => {
      setTaskToEdit(task_id);
      setTaskDialogMode("edit");
      setTaskDialogOpen(true);
    };

    const handleDeleteClick = () => {
      setTaskToDelete(task);
      setTaskDialogMode("delete");
      setTaskDialogOpen(true);
    };

    return (
      <div
        ref={ref}
        style={{
          padding: "8px",
          margin: "4px",
        }}
      >
        <Card sx={{ maxWidth: 345, position: "relative" }}>
          <CardActionArea onClick={() => navigateToTask(task.task_id,task.task_title)}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {task.task_title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
              {task.due_date}
              </Typography>
            </CardContent>
          </CardActionArea>
          {editMode === true && (
            <div>
              <IconButton
                onClick={() => handleEditClick(task.task_id)}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton onClick={handleDeleteClick} size="small">
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const useColumnDrop = (column_id: number) => {
    const [, ref] = useDrop({
      accept: ItemType,
      drop: () => ({ column_id } as DropResult),
    });
    return ref;
  };

  const Column: React.FC<{
    column: ColumnGetResspones;
    moveTask: (task_id: number, destination_column_id: number) => void;
  }> = ({ column, moveTask }) => {
    const ref = useColumnDrop(column.column_id);

    const handleEditClick = (column_id: number, column_name: string) => {
      setCurrentColumnId(column_id);
      setNewColumnName(column_name);
      setEditOpen(true);
    };

    const handleDeleteClick = (column_id: number) => {
      setColumnToDelete(column_id);
      setDeleteOpen(true);
    };

    const handleAddClick = (column_id: number) => {
      setTaskToEdit(column_id);
      setTaskDialogMode("add");
      setTaskDialogOpen(true);
    };

    return (
      <div
        ref={ref}
        style={{
          width: "300px",
          minHeight: "500px",
          backgroundColor: "lightblue",
          padding: "8px",
          margin: "8px",
          border: "1px solid black",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>{column.column_name}</h3>
        </div>
        <div>
          {editMode === true && (
            <>
              <IconButton
                onClick={() =>
                  handleEditClick(column.column_id, column.column_name)
                }
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                onClick={() => handleDeleteClick(column.column_id)}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
              <IconButton
                onClick={() => handleAddClick(column.column_id)}
                size="small"
              >
                <AddIcon />
              </IconButton>
            </>
          )}
        </div>
        {column.tasks.map((task) => (
          <TaskCard
            key={task.task_id}
            task={task}
            moveTask={moveTask}
            column_id={column.column_id}
          />
        ))}
      </div>
    );
  };

  const moveTask = async (task_id: number, destination_column_id: number) => {
    try {
      await axios.put(`http://localhost:3000/task/${task_id}`, {
        column_id: destination_column_id,
      });
      const response = await axios.get<ColumnGetResspones[]>(
        "http://localhost:3000/column/" + Fid
      );
      setColumns(response.data);
    } catch (error) {
      setError("Failed to move task");
    }
  };

  const addColumn = async (column_name: string, board_id: number) => {
    try {
      await axios.post("http://localhost:3000/column", {
        column_name,
        board_id,
      });
      const res = await axios.get<ColumnGetResspones[]>(
        "http://localhost:3000/column/" + Fid
      );
      setColumns(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const updateColumnName = async (column_id: number, column_name: string) => {
    try {
      await axios.put(`http://localhost:3000/column/${column_id}`, {
        column_name,
      });
      const res = await axios.get<ColumnGetResspones[]>(
        "http://localhost:3000/column/" + Fid
      );
      setColumns(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteColumn = async (column_id: number) => {
    try {
      await axios.delete(`http://localhost:3000/column/${column_id}`);
      const res = await axios.get<ColumnGetResspones[]>(
        "http://localhost:3000/column/" + Fid
      );
      setColumns(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddColumnClick = () => {
    setOpen(true);
  };

  const handlEditModeClick = () => {
    setEditMode(!editMode);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOpen(false);
    setDeleteOpen(false);
    setTaskDialogOpen(false);
    setNewColumnName("");
    setTaskToEdit(null);
    setTaskToDelete(null);
  };

  const handleConfirmAddColumn = () => {
    addColumn(newColumnName, Fid);
    handleClose();
  };

  const handleConfirmEditColumn = () => {
    if (currentColumnId !== null) {
      updateColumnName(currentColumnId, newColumnName);
    }
    handleClose();
  };

  const handleConfirmDeleteColumn = () => {
    if (columnToDelete !== null) {
      deleteColumn(columnToDelete);
    }
    handleClose();
  };
  ///เพิ่ม Task
  const handleConfirmAddTask = async () => {
    if (taskToEdit) {
      try {
        await axios.post(`http://localhost:3000/task/`, {
          task_title: newTaskName,
          column_id: taskToEdit,
        });
        const res = await axios.get<ColumnGetResspones[]>(
          "http://localhost:3000/column/" + Fid
        );
        setColumns(res.data);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
    handleClose();
  };

  ///แก้ไข Task
  const handleConfirmEditTask = async () => {
    if (taskToEdit) {
      try {
        await axios.put(`http://localhost:3000/task/${taskToEdit}`, {
          task_title: newTaskName,
        });
        const res = await axios.get<ColumnGetResspones[]>(
          "http://localhost:3000/column/" + Fid
        );
        setColumns(res.data);
      } catch (error) {
        console.error("Failed to update task:", error);
      }
    }
    handleClose();
  };

  ///ลบ Task
  const handleConfirmDeleteTask = async () => {
    if (taskToDelete) {
      try {
        await axios.delete(
          `http://localhost:3000/task/${taskToDelete.task_id}`
        );
        const res = await axios.get<ColumnGetResspones[]>(
          "http://localhost:3000/column/" + Fid
        );
        setColumns(res.data);
      } catch (error) {
        console.error("Failed to Delete task:", error);
      }
    }
    handleClose();
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

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
          Black
        </Button>
        <h1>{board.name}</h1>
        <Box>
          <Fab
            color="warning"
            aria-label="edit"
            onClick={handlEditModeClick}
            sx={{ marginLeft: 2 }}
          >
            <EditIcon />
          </Fab>
          <Fab
            color="success"
            aria-label="add"
            onClick={handleAddColumnClick}
            sx={{ marginLeft: 2 }}
          >
            <AddIcon />
          </Fab>
          <Fab
            color="default"
            aria-label="setting"
            onClick={navigateToBoardSetting}
            sx={{ marginLeft: 2 }}
          >
            <SettingsIcon />
          </Fab>
        </Box>
      </Box>
      <Container component="main">
        <DndProvider backend={HTML5Backend}>
          <div style={{ display: "flex" }}>
            {columns.map((column) => (
              <Column
                key={column.column_id}
                column={column}
                moveTask={moveTask}
              />
            ))}
          </div>
        </DndProvider>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>เพิ่มคอลัมน์ใหม่</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="ชื่อคอลัมน์"
              fullWidth
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmAddColumn} color="primary">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={editOpen} onClose={handleClose}>
          <DialogTitle>แก้ไขชื่อคอลัมน์</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="ชื่อคอลัมน์"
              fullWidth
              value={newColumnName}
              onChange={(e) => setNewColumnName(e.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmEditColumn} color="primary">
              ตกลง
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={deleteOpen} onClose={handleClose}>
          <DialogTitle>ยืนยันการลบคอลัมน์</DialogTitle>
          <DialogContent>
            <p>คุณแน่ใจหรือว่าต้องการลบคอลัมน์นี้?</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button onClick={handleConfirmDeleteColumn} color="secondary">
              ลบ
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={taskDialogOpen} onClose={handleClose}>
          <DialogTitle>
            {taskDialogMode === "add"
              ? "เพิ่ม Task"
              : taskDialogMode === "edit"
              ? "แก้ไข Task"
              : "ยืนยันการลบ Task"}
          </DialogTitle>
          <DialogContent>
            {taskDialogMode === "delete" ? (
              <p>คุณแน่ใจหรือว่าต้องการลบ Task นี้?</p>
            ) : (
              <TextField
                autoFocus
                margin="dense"
                label="ชื่อ Task"
                fullWidth
                value={newTaskName}
                onChange={(e) => setNewBoardName(e.target.value)}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ยกเลิก
            </Button>
            <Button
              onClick={
                taskDialogMode === "add"
                  ? handleConfirmAddTask
                  : taskDialogMode === "edit"
                  ? handleConfirmEditTask
                  : handleConfirmDeleteTask
              }
              color={taskDialogMode === "delete" ? "secondary" : "primary"}
            >
              {taskDialogMode === "add"
                ? "เพิ่ม"
                : taskDialogMode === "edit"
                ? "ตกลง"
                : "ลบ"}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default BoardPage;
