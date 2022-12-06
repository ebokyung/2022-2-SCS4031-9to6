import styled from "styled-components";
import {useState} from 'react';

const Wrapper = styled.div`
  margin: 25px auto;
`

const PageUl = styled.ul`
  float: left;
  list-style: none;
  text-align: center;
  border-radius: 3px;
  color: #979797;
  border: 1px solid #D9D9D9a7;
`

const PageLi = styled.li`
  display: inline-block;
  font-size: 16px;
  font-weight: 600;
  padding: 5px;
  border-radius: 3px;
  width: 25px;
  &:hover {
    cursor: pointer;
    color: white;
    background-color: #d9d9d9a7;
  }
  &:focus::after {
    color: white;
    background-color: #D9D9D9a7;
  }
`

const PageSpan = styled.span`
`
const Button = styled.button`
  margin: 0 10px;
`

export const Pagination2 = ({ postsPerPage, totalPosts, paginate }) => {

  const numPages = Math.ceil(totalPosts/postsPerPage)
  const [currPage, setCurrPage] = useState(1)

  return (
    <Wrapper>
      <nav>
        <Button 
            onClick={() => {paginate(currPage-1); setCurrPage(prev => prev-1);}} 
            disabled={currPage===1}>
            &lt;
        </Button>
        <PageSpan> {currPage} / {numPages === 0 ? 1 : numPages} </PageSpan>
        <Button 
            onClick={() => {paginate(currPage+1); setCurrPage(prev => prev+1);}} 
            disabled={currPage===numPages}>
            &gt;
        </Button> 
      </nav>
    </Wrapper>
  );
};

export default Pagination2;