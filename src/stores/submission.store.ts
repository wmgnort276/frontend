import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Submission, SubmissionDetail } from '@/types/interfaces/exercise';
import { getUserSubmissions, runTestCase, submitCode } from '@/api/exercise.api';
import { message } from 'ant-design-vue';
import { getSubmissionDetailApi } from '@/api/submit';

export const useSubmissionStore = defineStore('submissionStore', () => {
  const columns = ref<any>([
    { title: 'Status', dataIndex: 'status', key: 'status', width: 150 },
    { title: 'CreateAt', dataIndex: 'createAt', key: 'createAt', width: 400 },
    { title: 'Runtime', dataIndex: 'runtime', key: 'runtime', width: 300 },
    { title: 'Memory', dataIndex: 'memory', key: 'memory', width: 300 },
  ]);

  const submission = ref<Submission>();
  const submissionList = computed(() => submission.value);
  const response = ref<string>('');
  const responseStatus = ref<boolean>(true);
  const submissionDetail = ref<SubmissionDetail>();

  const getUserSubmissionsData = async (exerciseId: string) => {
    try {
      const response : any = await getUserSubmissions(exerciseId);
      submission.value = response?.data;
    } catch(error) {
      console.log(error);
    }
  };

  const handleSubmitCode = async (exerciseId: string, code: string, language: string) => {
    await submitCode({
      code: code,
      id: exerciseId,
      lang: language
    })
      .then((res: any) => {
        if (res?.data == 'Success') {
          responseStatus.value = true;
          message.success('Success');
        } else {
          responseStatus.value = false;
          // message.error('Wrong answer');
        }
        response.value = (res?.data != '0') ? res?.data : 'Wrong answer';
      })
      .catch((error: any) => {
        message.error(error?.response?.data ? error?.response?.data : 'Compile failed!');
        console.log(error);
      })
      .finally(async () => {
        // await getUserSubmissionsData(exerciseId);
      });
  };

  const handleRunTestCase = async (exerciseId: string, code: string, language: string) => {
    await runTestCase({
      code: code,
      id: exerciseId,
      lang: language
    })
      .then((res: any) => {
        if (res?.data == 'Success') {
          responseStatus.value = true;
          message.success('Success');
        } else {
          responseStatus.value = false;
          // message.error('Wrong answer');
        }
        response.value = (res?.data != '0') ? res?.data : 'Wrong answer';
      })
      .catch((error: any) => {
        message.error(error?.response?.data ? error?.response?.data : 'Compile failed!');
        console.log(error);
      })
      .finally(async () => {
        // await getUserSubmissionsData(exerciseId);
      });
  };

  const getSubmissionDetail = async (id: string) => {
    try {
      const res : any = await getSubmissionDetailApi(id);
      submissionDetail.value = res?.data;
    } catch(error) {

    }
  }

  return {
    columns,
    submission,
    submissionList,
    response,
    responseStatus,
    submissionDetail,
    getSubmissionDetail,
    getUserSubmissionsData,
    handleSubmitCode,
    handleRunTestCase
  }
})