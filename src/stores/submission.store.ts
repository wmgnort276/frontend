import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Submission } from '@/types/interfaces/exercise';
import { getUserSubmissions, submitCode } from '@/api/exercise.api';
import { message } from 'ant-design-vue';

export const useSubmissionStore = defineStore('submissionStore', () => {
  const columns = ref<any>([
    { title: 'Status', dataIndex: 'status', key: 'status', width: 150 },
    { title: 'CreateAt', dataIndex: 'createAt', key: 'createAt', width: 400 },
    { title: 'Runtime', dataIndex: 'runtime', key: 'runtime', width: 300 },
    { title: 'Memory', dataIndex: 'memory', key: 'memory', width: 300 },
  ]);

  const submission = ref<Submission>();
  const submissionList = computed(() => submission.value);

  const getUserSubmissionsData = async (exerciseId: string) => {
    try {
      const response : any = await getUserSubmissions(exerciseId);
      submission.value = response?.data;
    } catch(error) {
      console.log(error);
    }
  };

  const handleSubmitCode = async (exerciseId: string, code: string) => {
    await submitCode({
      code: code,
      id: exerciseId
    })
      .then((res: any) => {
        if (res?.data == '1') {
          message.success('Success');
          return true;
        } else {
          message.error('Wrong answer');
        }
      })
      .catch((error: any) => {
        message.error(error?.response?.data ? error?.response?.data : 'Compile failed!');
        console.log(error);
      })
      .finally(async () => {
        // await getUserSubmissionsData(exerciseId);
      });
  };

  return {
    columns,
    submission,
    submissionList,
    getUserSubmissionsData,
    handleSubmitCode
  }
})