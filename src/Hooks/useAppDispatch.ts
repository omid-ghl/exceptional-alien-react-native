import {AppDispatch} from '@/Store';
import {useDispatch} from 'react-redux';

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
