import { Box } from '@mui/material';
import Navbar from '../components/layout/Navbar';
import TaskBoard from '../components/tasks/TaskBoard';

const TasksPage = () => {
  return (
    <Box minHeight="100vh" sx={{ backgroundColor: 'background.default' }}>
      <Navbar />
      <TaskBoard />
    </Box>
  );
};

export default TasksPage;