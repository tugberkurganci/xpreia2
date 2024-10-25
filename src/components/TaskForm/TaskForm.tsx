import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import axiosInstance from "../../utils/axiosInterceptors";
import { TaskRequest, TaskResponse } from "../../models/models";
import { Button } from "react-bootstrap";
import { toast } from "react-toastify";

interface TaskFormProps {
  taskId?: number; // taskId varsa, bir görevi düzenliyoruz demektir
  projectId: number;
  fetchTasks: (projectId:any) => void;
  closeModal: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ taskId, projectId, fetchTasks, closeModal }) => {
  const [initialValues, setInitialValues] = useState<TaskRequest>({ title: '', description: '', status: '' });
  const [statuses, setStatuses] = useState<string[]>(["NEW","IN_PROGRESS","COMPLETED"]);

  useEffect(()  => {
    

      // taskId varsa, bir görevi düzenliyoruz, bu durumda taskId ile görev bilgilerini getir
      if (taskId) {
        try {
          fetchTask(taskId)
        } catch (error) {
          
          console.error('Görev bilgilerini getirirken hata oluştu:', error);
        }
      }
    

  
  }, [taskId]);

  const fetchTask =async (taskId:number)=>{
    const response = await axiosInstance.get<TaskResponse>(`/tasks/${taskId}`);
    const { title, description, status } = response.data;
    setInitialValues({ title, description, status });
  }

  const handleSubmit = async (values: TaskRequest) => {
    const taskData: TaskRequest = {
      projectId,
      title: values.title,
      description: values.description,
      status: values.status,
      createdDate: new Date().toISOString(),
    };

    try {
      // taskId varsa, bir görevi düzenliyoruz, aksi halde yeni bir görev ekliyoruz
      if (taskId) {
        await axiosInstance.put<TaskResponse>(`/tasks/${taskId}`, taskData);
      } else {
        await axiosInstance.post<TaskResponse>(`/tasks`, taskData);
      }
      fetchTasks(projectId)
      closeModal();
    } catch (error:any) {
      console.error('Görev işlemi sırasında hata oluştu:', error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize={true}
      onSubmit={handleSubmit}
      validate={(values) => {
        const errors: any = {};
        if (!values.title) {
          errors.title = 'Görev başlığı zorunludur';
        }
        if (!values.status) {
          errors.status = 'Görev durumu seçmelisiniz';
        }
        return errors;
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="form-group">
            <label htmlFor="title">Görev Başlığı</label>
            <Field type="text" name="title" className="form-control" />
            <ErrorMessage name="title" component="div" className="text-danger" />
          </div>
          <div className="form-group">
            <label htmlFor="description">Görev Açıklaması</label>
            <Field type="text" name="description" className="form-control" />
          </div>
          <div className="form-group">
            <label htmlFor="status">Görev Durumu</label>
            <Field as="select" name="status" className="form-control">
              <option value="" disabled>Seçiniz</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Field>
            <ErrorMessage name="status" component="div" className="text-danger" />
          </div>
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            {taskId ? 'Görevi Düzenle' : 'Görev Ekle'}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default TaskForm;

