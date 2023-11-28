import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Submission } from '@/types/interfaces/exercise';
import { getUserSubmissions, submitCode } from '@/api/exercise.api';
import { message } from 'ant-design-vue';
import { SUBMISSION_PAGE } from './constants/constant';


export const useSubmissionStore = defineStore('submissionStore', () => {
  const columns = ref<any>([
    { title: 'Status', dataIndex: 'status', key: 'status', width: 200 },
    { title: 'CreateAt', dataIndex: 'createAt', key: 'createAt', width: 500 },
    { title: 'Runtime', dataIndex: 'runtime', key: 'runtime', width: 300 },
  ]);

  const submission = ref<Submission>();
  const submissionList = computed(() => submission.value);

  const getUserSubmissionsData = async (exerciseId: string) => {
    await getUserSubmissions(exerciseId)
      .then((res: any) => {
        submission.value = res?.data
      })
      .catch((error: any) => {
      })
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
        await getUserSubmissionsData(exerciseId);
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