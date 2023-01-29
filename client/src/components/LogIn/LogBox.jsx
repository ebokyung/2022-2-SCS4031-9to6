import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { API } from '../../axios';

const Container = styled.section`
    width: 50%;
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 40px;;
`

const Title = styled.h2`
    font-size: 2rem;
    color: ${props => props.theme.logColor};
    margin-top: 100px;
`

const Form = styled.form`
    width: 100%;
`

const Alert = styled.p`
    margin: 30px auto;
    font-size: 0.5rem;
    text-align: center;
    color: red;
`

const FieldSet = styled.div`
    margin-bottom: 20px;
    width: 100%;
`
const Label = styled.div`
    font-size: 0.7rem;
    margin-bottom: 5px;
    color: ${props => props.theme.logColor};
`

const Input = styled.input`
    width: 100%;
    height: 32px;
    padding: 7px 10px;
    border: 1px solid ${props => props.theme.logInputBorderColor};
    border-radius: 3px;
    ::placeholder {
        color: #dadada;
    }
    :focus {
        outline-color: ${props => props.theme.logInputBorderColor};
    }
`

const Btn = styled.button`
    width: 100%;
    height: 35px;
    margin-bottom: 20px;
    border-radius: 3px;
    border: none;
    background-color: ${props => props.theme.logBtnBackColor};
`

const Link = styled.a`
    margin: 10px 0;
    font-size: 0.7rem;
`

function LogBox () {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onValid = async (data) => {
        const result = {
            "ID": data.id,
            "Password": data.pw,
        };
        sessionStorage.setItem("token", JSON.stringify(result));
        navigate("/")


    //     try{
    //         await API.post('/Login', result).then(
    //             response => {
    //                 console.log(response);
    //             }
    //         )
    //         navigate("/")
    //     } catch(error){
    //         console.log(error)
    //     }
    };
    
    return(
    <Container>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit(onValid)}>
            <Alert>{errors?.id?.message || errors?.pw?.message}</Alert>
            <FieldSet>
                <Label>아이디</Label>
                <Input {...register("id", { 
                    required: "* 아이디를 입력해주세요.", })}
                    placeholder="id">
                </Input>
            </FieldSet>
            <FieldSet>
                <Label>비밀번호</Label>
                <Input {...register("pw", { 
                    required: "* 비밀번호를 입력해주세요.", })}
                    type='password'
                    placeholder="password">
                </Input>
            </FieldSet>
            <Btn>
                로그인
            </Btn>
        </Form>
        <Link href='/signup'>회원가입</Link>
        <Link>아이디/비밀번호 찾기</Link>
    </Container>
    )
}
export default LogBox;