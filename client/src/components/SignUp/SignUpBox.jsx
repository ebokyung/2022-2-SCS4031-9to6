import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
// import { API } from '../../axios';

const Container = styled.section`
    width: 50%;
    height: 450px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: auto;
    padding-top: 40px;;
`

const Form = styled.form`
    width: 100%;
`

const Title = styled.h2`
    font-size: 2rem;
    color: ${props => props.theme.logColor};
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
const AlertP = styled.p`
    margin: 30px auto;
    font-size: 0.5rem;
    text-align: center;
    color: red;
`

const AlertSpan = styled.span`
    float: right;
    font-size: 0.5rem;
    color: red;
    ${props => props.isActive === 'yes' ? 'display:none;': ''}
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

function SignUpBox () {
    const navigate = useNavigate();
    // 비밀번호 입력 형식
    var regExp = /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/;

    // submit 했을때 유효하면
    const onSubmit = async(result) => {
        console.log(result);
        // try{
        //     await API.post('/api/...', result).then(
        //         response => {
        //             console.log(response);
        //         }
        //     )
        window.alert("회원가입이 완료되었습니다. 🙌🏻");
        navigate("/login");
        // } catch(error){
        //     console.log(error)
        // }
    }

    // submit 했을때 각 입력창 유효성 확인하기
    const {
        register,
        handleSubmit,
        formState: { errors },
        setError
    } = useForm();

    const onValid = (data) => {
        if (data.pw !== data.pw1){
            window.alert("비밀번호가 일치하지 않습니다.")
            setError("pw1", {shouldFocus : true})
            return
        }
        // 에러없으면 
        const result = {
            'ID': data.id,
		    'e-mail': data.email,
		    'password': data.pw,
        }
        onSubmit(result);
    };

    // 아이디 입력할때마다 중복 확인하기
    // ...

    // 비밀번호 입력할때마다 조건에 맞는지 검사하기
    const [inputPw, setInputPw] = useState();
    const [isValidPw, setIsValidPw] = useState(false);
    const validateValue = (value) => {
        if (!regExp.test(value)) {
            setIsValidPw(false);
        } else {
            setIsValidPw(true);
        }
    }
    const onChangePw = (e) => {
        setInputPw(e.target.value);
        validateValue(e.target.value);
    }


    return(
    <Container>
        <Title>회원가입</Title>
        <Form onSubmit={handleSubmit(onValid)}>
            <AlertP>{errors?.email?.message || errors?.id?.message || errors?.pw?.message || errors?.pw1?.message}</AlertP>
            <FieldSet>
                <Label>이메일</Label>
                <Input {...register("email", { 
                    required: "* 이메일을 입력해주세요.", 
                    pattern: {
                        value: /\S+@\S+\.\S+/,
                        message: "* 이메일 형식에 맞지 않습니다.",
                      }})}
                    placeholder="username@example.com">
                </Input>
            </FieldSet>
            <FieldSet>
                <Label>
                    아이디
                    {/* <AlertSpan>* 사용 가능한 아이디입니다.</AlertSpan> */}
                </Label>
                <Input {...register("id", { 
                    required: "* 아이디를 입력해주세요.", })}
                    placeholder="id">
                </Input>
            </FieldSet>
            <FieldSet>
                <Label>비밀번호
                    <AlertSpan isActive={isValidPw ? 'yes' : 'no'}>* 영문, 숫자, 특수문자 중 2가지 이상 조합하여 8자리</AlertSpan>
                </Label>
                <Input {...register("pw", { 
                    required: "* 비밀번호를 입력해주세요.", 
                    pattern: {
                        value: /^(?!((?:[A-Za-z]+)|(?:[~!@#$%^&*()_+=]+)|(?=[0-9]+))$)[A-Za-z\d~!@#$%^&*()_+=]{8,}$/,
                        message: "* 비밀번호를 조건에 맞게 입력해주세요.",
                    }})}
                    onChange={onChangePw}
                    value={inputPw}
                    type='password'
                    placeholder="password">
                </Input>
            </FieldSet>
            <FieldSet>
                <Label>
                    비밀번호 확인
                </Label>
                <Input {...register("pw1", { 
                    required: "* 비밀번호 확인이 필요합니다.", })}
                    type='password'
                    placeholder="password">
                </Input>
            </FieldSet>
            <Btn>
                회원가입
            </Btn>
        </Form>
    </Container>
    )
}
export default SignUpBox;