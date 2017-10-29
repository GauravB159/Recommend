import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import ReactPlayer from 'react-player'

export default class Movie extends React.Component {
  constructor(props) {
    super(props)
    this.state={
      linkArr:[],
      currCategory:'Sports',
      currLink:"",
      show:false,
      loading:true,
      dontClose:false,
      rating:"Rating Not Given Yet"
    }
  }

  componentDidMount() {
    axios.get('http://localhost:8000/videos/upload/',{
      params: {
        category: this.state.currCategory.toLowerCase()
      }
    })
    .then((response)=>{
      console.log(response.data);
      let arr=response.data;
      arr.shift();
      let first=arr.shift();
      this.setState({
        linkArr:arr,
        currLink:first,
      });
    })
    .catch((error)=> {
      console.log(error);
    });
    $("#rateYo").rateYo({
      normalFill: "#A0A0A0",
      halfStar:true,
      onSet: (r,i)=>{ this.setState({ rating: r })}
    });
  }

  componentDidUpdate() {
  if(this.state.show && !this.state.dontClose)
    $('.ui.modal').modal('show');
  else
    $('.ui.modal').modal('hide');
  }
  handleVidClick(){
    let vid = document.getElementById("playing_vid").querySelector('video');
    let buttonImage = document.getElementById('protograph_play_img');
    if(vid.paused){
      buttonImage.src = 'https://storage.googleapis.com/g2gcs-hosting-toaudiophoto-066678fc87/src/images/pause.png';
      vid.play();
    } 
    else{
      buttonImage.src = "https://storage.googleapis.com/g2gcs-hosting-toaudiophoto-066678fc87/src/images/play.png"
      vid.pause();
    }  
  }
  handleClick(event){
    console.log(event.target);
    Array.from(document.getElementsByClassName('active')).forEach((element)=>{
      console.log(element);
      element.className = 'item';
    });
    let target=event.target;
    event.target.className='item active';
    axios.get('http://localhost:8000/videos/upload/',{
      params: {
        category: target.innerHTML.toLowerCase()
      }
    })
    .then((response)=>{
      let arr=response.data;
      arr.shift();
      console.log(arr);
      let first=arr.shift();
      this.setState({
        linkArr:arr,
        currLink:first,
        currCategory:target.innerHTML,
        show:this.state.close,
        close:false

      });
    })
    .catch((error)=> {
      console.log(error);
    });
  }
  handleMouseEnter(e) {
    document.getElementById('protograph_play_button').style.background = "rgba(0, 0, 0, 0.6)";
    document.getElementById('protograph_play_button').style.opacity = 1;
  }
  handleMouseLeave(e) {
    document.getElementById('protograph_play_button').style.background = "rgba(0, 0, 0, 0.25)";
    document.getElementById('protograph_play_button').style.opacity = 0;
  }
  loadVideo(e){
    let links=this.state.linkArr;
    let index=links.indexOf(e.target.src);
    links.splice(links.indexOf(e.target.src),1);
    links.splice(index,0,this.state.currLink);
    this.setState({
      currLink: e.target.src,
      linkArr:links,
      show:false
    });
  }
  render() {
    let vids=this.state.linkArr;
    let vids1=vids.filter((dat,index) => index % 2);
    let vids2=vids.filter((dat,index)=> !(index % 2));
    return(
      <div>
        <div className="pusher">
          <div className="ui inverted vertical masthead center aligned segment">
            <div className="ui container" style={{position:'relative'}}>
              <div className="ui large secondary inverted pointing menu">
                <b className = "bold" style={{marginTop:10}}>RecommendIT</b>
                <div style={{width:"100%"}}>
                  <a className="item" id="all" style={{display:"inline-block"}} onClick={(e)=> this.handleClick(e)}>All</a>
                  <a className="item" id="cookery" style={{display:"inline-block"}} onClick={(e)=> this.handleClick(e)}>Cookery</a>
                  <a className="item active" id="sports" style={{display:"inline-block"}} onClick={(e)=> this.handleClick(e)}>Sports</a>
                  <a className="item" id="dance" style={{display:"inline-block"}} onClick={(e)=> this.handleClick(e)}>Dance</a>
                </div>
                <div style={{cursor:"pointer",width:250,position:'relative'}}>
                  <div style={{height:36,width:36,backgroundColor:'white',borderRadius:"100%",marginRight:10,display:'inline-block'}}>
                    <img src="https://www.1plusx.com/app/mu-plugins/all-in-one-seo-pack-pro/images/default-user-image.png" style={{borderRadius:"100%",height:36,width:36}}/>
                  </div>
                  <div style={{fontSize:20,fontWeight:"bold",marginTop:-10,display:'inline-block',position:'absolute',bottom:10}}>
                    Username
                  </div>             
                </div>  
              </div>              
              <div id="main_area" style={{position:'relative'}}>
                <div id="playing_vid" style={{width:740,height:420}} onMouseLeave={()=> this.handleMouseLeave()} onMouseEnter={()=> this.handleMouseEnter()}>
                  <button id="protograph_play_button" onClick={()=> this.handleVidClick()} style={{opacity:0,cursor:'pointer',zIndex:'10'}}>
                    <img id="protograph_play_img" src="https://storage.googleapis.com/g2gcs-hosting-toaudiophoto-066678fc87/src/images/pause.png" alt=""/>
                  </button>
                  <div style={{textAlign:'left',fontSize:34,marginBottom:20}}>
                    {this.state.currCategory}
                  </div>
                  <ReactPlayer url={this.state.currLink} playing loop width="700" height="400" style={{backgroundColor:'black'}} />
                </div>
                <div id="rateYo" style={{marginTop:30}}></div>
                <div style={{width:'fit-content', fontSize:20,marginTop:5, marginLeft:8  }}>
                {this.state.rating === "Rating Not Given Yet" ? <div>{this.state.rating}</div> : <div>Your rating for this movie: {this.state.rating} / 5</div>}
                </div>
                <div style={{right:0,top:0,position:'absolute'}}>
                  <div style={{textAlign:'right',fontSize:24,marginBottom:20}}>
                    Other Videos in this Category
                  </div>
                  <div style={{overflowX:'hidden',width:"100%",height:"500px"}}>
                    <div style={{position:'absolute', right:-30,top:37,overflowY:'auto',height:'500px'}}>
                      {
                        vids.map((dat,index)=>{
                          return (
                            <div onClick={(e)=> this.loadVideo(e)} style={{cursor:'pointer'}}>
                              <ReactPlayer url={dat} style={{marginTop: index === 0 ? 0 : 30}} loop height="180" width="280" />
                            </div>
                          );
                        })
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}