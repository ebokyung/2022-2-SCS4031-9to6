import styled from "styled-components";
import {useState} from 'react';

const Wrapper = styled.div`
  margin: 25px auto;
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