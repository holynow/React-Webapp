import React, { useState } from 'react'

const Header =(props)=>{
  return(
    <header>
      <h1>
        <a href='/' onClick={(event)=>{
          event.preventDefault();
          props.onChangeMode();
        }}>{props.title}</a>
      </h1>
    </header>
  )
}
const Nav =(props)=> {
  const lis = [];
  props.topics.map((item) => lis.push(<li key={item.id}><a id={item.id} href={`/read/${item.id}`} onClick={(event)=>{
    event.preventDefault();
    props.onChangeMode(Number(event.target.id));
  }}>{item.title}</a></li>));
  return(
    <nav>
    <ol>
      {lis}
    </ol>
  </nav>
  )
}
const Article =(props)=> {
  return(
    <article>
      <h2>{props.title}</h2>
      {props.body}
    </article>
  )
}
const Create =(props)=>{
  return(
    <article>
      <h2>Create</h2>
      <form onSubmit={event=> {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onCreate(title, body);
      }}>
        <p><input type='text' name="title" placeholder='title'></input></p>
        <p><textarea name='body' placeholder='body'></textarea></p>
        <p><input type='submit' value="Create"></input></p>
      </form>
    </article>
  )
}
const Update =(props)=>{
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);
  return (
    <article>
      <h2>Update</h2>
      <form onSubmit={event=> {
        event.preventDefault();
        const title = event.target.title.value;
        const body = event.target.body.value;
        props.onUpdate(title, body);
      }}>
        <p><input type='text' name="title" placeholder='title' value={title} onChange={event => {
          setTitle(event.target.value);
        }}></input></p>
        <p><textarea name='body' placeholder='body' value={body} onChange={event => {
          setBody(event.target.value);
        }}></textarea></p>
        <p><input type='submit' value="Update"></input></p>
      </form>
    </article>
  )
}

function App() {
  const [mode, setMode] = useState('');
  const [id, setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title:"html", body:"html is ..."},
    {id:2, title:"css", body:"css is ..."},
    {id:3, title:"javascript", body:"javascript is ..."},
  ]);
  let content = null;
  let contextControl = null;
  if(mode === "WELCOME"){
    content = <Article title="Welcome" body="Hello, WEB"></Article>
  } else if (mode === 'READ'){
    topics.map(item => item.id === id ? content = <Article title={item.title} body={item.body}></Article> : null );
    contextControl = 
    <>
      <li><a href={`/update/${id}`} onClick={event => {
        event.preventDefault();
        setMode('UPDATE');
      }}>upadate</a></li>
      <li><input type='button' value="Delete" onClick={()=>{
        const updatedTopics = topics.filter(topics => topics.id !== id).map(topic => ({...topic}));
        setTopics(updatedTopics)
        setMode('WELCOME')
      }}></input></li>
    </>;
  } else if (mode === 'CREATE'){
    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>
  } else if (mode === 'UPDATE') {
    topics.map(item => item.id === id ? content = <Update title={item.title} body={item.body} onUpdate={(title, body)=>{
    const updatedTopics = topics.map(item => (item.id === id ? { ...item, title, body } : item));
    setTopics(updatedTopics);
    }}></Update> : null )

  }
  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode("WELCOME");
      }}></Header>
      <Nav topics={topics} onChangeMode={(_id)=>{
         setMode("READ");
         setId(_id)
      }}></Nav>
      {content}
      <ul>
      <li>
        <a href='/create' onClick={event => {
          event.preventDefault();
          setMode("CREATE");
        }}>Create</a>
      </li>
       {contextControl}
      </ul>
    </div>
  )
}

export default App