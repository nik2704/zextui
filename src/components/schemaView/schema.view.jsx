import React, { useRef, useState, useEffect } from 'react';
import {ReactSvgPanZoomLoader} from './react-svg-pan-zoom-loader';
import {INITIAL_VALUE, ReactSVGPanZoom, TOOL_NONE, Toolbar, fitSelection, zoomOnViewerCenter, fitToViewer} from './react-svg-pan-zoom';
import { Modal } from '../modal';
import { postSMAXData } from '../../utils/commonMethods';

export function SchemaView(props) {
    const getOwnerName = ( relProps ) => {
      if (relProps.OwnedByPerson !== undefined) {
        return relProps.OwnedByPerson.Name
      } else {
        return 'OWNER NOT SELECTED';
      }
    }

  //console.log(props.state);
    const Viewer = useRef(null);
    const border = useRef(null);
    const [tool, setTool] = useState(TOOL_NONE);
    const [value, setValue] = useState(INITIAL_VALUE);
    const [svgLink, setSvgLink] = useState(null);
    const [needSave, setNeedSave] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedCoords, setSelectedCoords] = useState({});
    const [figures, setFigures] = useState([]);
    const [currentTitleObj, setCurrentTitleObj] = useState({
      id: props.state.currentCi.properties.Id,
      subType: props.state.currentCi.properties.SubType,
      displayLabel: props.state.currentCi.properties.DisplayLabel,
      owner: getOwnerName(props.state.currentCi.related_properties)
    });
  //props.state.currentCi.related_properties.OwnedByPerson.Name
    
    useEffect(() => {
        if (svgLink != null) {
          Viewer.current.fitToViewer();
        }
        
      }, [svgLink]);

    useEffect(() => {
        if (props.state.selectedMap.id !== null) {
          setSvgLink(`https://${props.state.cfg.thost}/rest/${props.state.cfg.tid}/frs/file-list/${props.state.selectedMap.id}`);
          //setSvgLink(`http://${props.state.cfg.thost}:4050/att/instance?id=${props.state.selectedMap.id}&token=${props.state.token}`);
        }
    }, [props.state.selectedMap.id]);

    useEffect(() => {
        doDrawOthersCIs();
    }, [props.state.showOtherCIs]);
 
    const renderModal = () => {
        if (showModal === false) return '';
    
        return (
            <Modal
                title='Saving coordinates in SMAX record'
            />
        )    
    }
   
    const renderList = () => {
      if (props.state.showOtherCIs === true) {
        if (props.state.fetchedData.ciColocated.entities !== undefined) {
          if (props.state.fetchedData.ciColocated.entities.length > 0) {
              return (
                <div className="ui relaxed divided list">
                  {props.state.fetchedData.ciColocated.entities.filter(
                    item => (item.properties.Id != props.state.currentCi.properties.Id && item.properties.MapKey_c === props.state.selectedMap.id)
                  ).map( (item, idx) => {
                    return (
                      <div className="item" key={`${idx}-${item.properties.Id}`}>
                        <i className='large server middle aligned icon'></i>
                        <div className="content" onMouseEnter={e => mouseEnter(e, item.properties.Id)} onMouseLeave={e => mouseLeave(e, item.properties.Id)}>
                          <a href={`https://${props.state.cfg.thost}/saw/Device/${item.properties.Id}/general?TENANTID=${props.state.cfg.tid}`} className="header" target="_blank">{item.properties.DisplayLabel}</a>
                          <div className="description">{getOwnerName(item.related_properties)}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
          }
        }
      }

      return '';
    }

    const mouseEnter = ( e, id ) => {
      e.preventDefault();

      let figure = Viewer.current.ViewerDOM.getElementById(`${id}-rect`);    

      if ( figure !== null) {
        figure.setAttributeNS(null,"fill","gold");
      }
    }

    const mouseLeave = ( e, id ) => {
      e.preventDefault();

      let figure = Viewer.current.ViewerDOM.getElementById(`${id}-rect`);    

      if ( figure !== null) {
        figure.setAttributeNS(null,"fill","white");
      }
    }

    const renderContent = () => {
        if (svgLink !== null) {
          return (
            <div ref={border}>
              <ReactSvgPanZoomLoader
                src={svgLink}
                doDraw={doDrawFigure}
                render={(content) => {
                  return (
                    <React.Fragment>
                      <ReactSVGPanZoom
                        ref={Viewer}
                        width={1100}
                        height={600}
                        tool={tool}
                        onChangeTool={setTool}
                        value={value}
                        onChangeValue={setValue}
                        undo={undoFigure}
                        Toolbar={Toolbar}
                        onClick={event => onClick(event)}
                      >
                      <svg width={2500} height={1200}>
                          {content}
                      </svg>
                      </ReactSVGPanZoom>
                      <div className="ui hidden divider"></div>
                      <div className="ui menu">
                        <div className="ui buttons">
                            <button className={needSave === true ? 'ui button' : 'ui button disabled'} onClick={onCancel}>Clear</button>
                            <div className="or"></div>
                            <button className={needSave === true ? 'ui positive button' : 'ui positive button disabled'} onClick={onSave}>Save</button>
                        </div>
                        <div className="right menu">
                            <div class="item">
                                <div className="ui checkbox">
                                    <input type="checkbox" checked={props.state.showOtherCIs} name="example" onClick={()=> {
                                        props.switchStateField(['showOtherCIs'], [!props.state.showOtherCIs]);
                                    }} />
                                    <label>Show other CIs</label>
                                </div>
                            </div>
                        </div>
                      </div>

                    </React.Fragment>
                  )
                }}/>
            </div>
      
        )
        } else {
            return (
                <div>
                    LOADING        
                </div>
            )
        }
    }

    const doDrawFigure = () => {
        if (
            (props.state.selectedMap.id !== null) && 
            (props.state.selectedMap.file_name !== null) && 
            (props.state.selectedPoint.x !== null) && 
            (props.state.selectedPoint.y !== null) &&
            (props.state.selectedMap.id === props.state.currentCi.properties.MapKey_c)
            ) {
          addFigure(props.state.selectedPoint.x, props.state.selectedPoint.y, 'red', currentTitleObj);
        }
    }

    const doDrawOthersCIs = () => {
      if (props.state.showOtherCIs === true) {
        if (props.state.fetchedData.ciColocated.entities !== undefined) {
            if (props.state.fetchedData.ciColocated.entities.length > 0) {
                props.state.fetchedData.ciColocated.entities.forEach(item => {
                  if (item.properties.MapKey_c === props.state.selectedMap.id) {
                    if (item.properties.Id != props.state.currentCi.properties.Id) {
                      const x = item.properties.MapX_c || 0;
                      const y = item.properties.MapY_c || 0;
                      const DisplayLabel = item.properties.DisplayLabel;

                      drawFigure(x, y, 'green', {
                        id: item.properties.Id,
                        subType: item.properties.SubType,
                        displayLabel: DisplayLabel,
                        owner: getOwnerName(item.related_properties)
                      });
                    }
                  }
                });
            }
        }
      } else {
        props.state.fetchedData.ciColocated.entities.forEach(item => {
          if (Viewer.current != null && props.state.currentCi.properties.Id != item.properties.Id) {
            removeElements(item.properties.Id);
          }
        });
      }
    }

    const removeElements = (baseId) => {
      let root = Viewer.current.ViewerDOM.getElementsByTagName('svg')[0];
      let oldCircle = Viewer.current.ViewerDOM.getElementById(baseId);    
      let oldCircleText = Viewer.current.ViewerDOM.getElementById(`${baseId}-text`);    
      let oldCircleRect = Viewer.current.ViewerDOM.getElementById(`${baseId}-rect`); 

      if ( oldCircle !== null) {
        root.removeChild(oldCircle);
      }

      if ( oldCircleText !== null) {
        root.removeChild(oldCircleText);
      }
      
      if ( oldCircleRect !== null) {
        root.removeChild(oldCircleRect);
      }  
    }

    const drawFigure = (x, y, color, titleObj) => {
        if (Viewer.current !== null) {
          let root = Viewer.current.ViewerDOM.getElementsByTagName('svg')[0];
          let oldCircle = Viewer.current.ViewerDOM.getElementById(titleObj.id);    
          let oldCircleText = Viewer.current.ViewerDOM.getElementById(`${titleObj.id}-text`);    
          let oldCircleRect = Viewer.current.ViewerDOM.getElementById(`${titleObj.id}-rect`);    
      
          let circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          circles.setAttribute("cx",x);
          circles.setAttribute("cy",y);
          circles.setAttribute("r",10);
          circles.setAttribute("stroke", color);
          circles.setAttribute("stroke-width", 3);
          circles.setAttribute("fill", color);
          circles.setAttribute("id", titleObj.id);
      
          if ( oldCircle !== null) {
            root.removeChild(oldCircle);
          }
  
          if ( oldCircleText !== null) {
            root.removeChild(oldCircleText);
          }
          
          if ( oldCircleRect !== null) {
            root.removeChild(oldCircleRect);
          }
  
          let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  
          rect.setAttribute('width', '300');
          rect.setAttribute('height', '40');
          rect.setAttribute('x', x - 20);
          rect.setAttribute('y', y - 21);
          rect.setAttribute('fill', '#fff');
          rect.setAttribute('stroke', color);
          rect.setAttribute('stroke-width', '2');
          rect.setAttribute('rx', '7');
          rect.setAttribute('id', `${titleObj.id}-rect`);
  
          const txt = `Id:${titleObj.id}\nSubType:${titleObj.subType}\nOwner:${titleObj.owner}`;
  
          let tx = parseInt(new Number(x).toFixed()) + 20, ty = parseInt(new Number(y).toFixed()) + 7;        
          let newText = document.createElementNS("http://www.w3.org/2000/svg","text");
          newText.setAttributeNS(null,"x", tx);
          newText.setAttributeNS(null,"y", ty);
          newText.setAttributeNS(null,"fill", color);
          newText.setAttributeNS(null,"width","100%");
          newText.setAttributeNS(null,"height","auto");
          newText.setAttributeNS(null,"font-size","22");
          newText.setAttributeNS(null,"id",`${titleObj.id}-text`);
          newText.appendChild(document.createTextNode(titleObj.displayLabel));
          
          circles.appendChild(getTitleNode(txt));
          rect.appendChild(getTitleNode(txt));
          newText.appendChild(getTitleNode(txt));  
  
          root.appendChild(rect);
          root.appendChild(circles);
          root.appendChild(newText);
  
          if (titleObj.id === props.state.currentCi.properties.Id) {
              setSelectedCoords({x, y, rootObj: root, childObj: [circles, rect, newText]});
          }
        }
    }

    const getTitleNode = (txt) => {
      let title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      let textNode = document.createTextNode(txt);
      title.appendChild(textNode);

      return title;
    }

    const addFigure = (x, y, color, titleObj) => {
        drawFigure(x, y, color, titleObj);
        let newFigures = figures;

        const id = titleObj.id;
        const label = titleObj.displayLabel;

        newFigures.push({x, y, color, id, label});
        setFigures(newFigures);
    }
    
    const undoFigure = () => {
        if (figures.length > 1) {
          let newFigures = figures;
          newFigures.pop();
          setFigures(newFigures);
          const currPoint = newFigures[newFigures.length - 1];
          drawFigure(currPoint.x, currPoint.y, 'red', currentTitleObj)
        }
    }

    const onClick = (event) => {
        event.preventDefault();
        setNeedSave(true);
    
        const x = event.point.x - event.point.x * 0.25;
        const y = event.point.y - event.point.y * 0.25;

        addFigure(x, y, 'red', currentTitleObj);
    
    }

    const onCancel = (event) => {
        event.preventDefault();
        removeElements(props.state.currentCi.properties.Id);
        setSelectedCoords({})
        setFigures([]);
        setNeedSave({});
    }

    const onSave = (event) => {

        event.preventDefault();
    
        const updtBody = {
          "entities": [
              {
                  "entity_type": props.state.srcObj.recType,
                  "properties": {
                      "MapKey_c": props.state.selectedMap.id,
                      "MapName_c": props.state.selectedMap.file_name,
                      "MapX_c": selectedCoords.x,
                      "MapY_c": selectedCoords.y,
                      "Id": props.state.srcObj.id
                  },
                  "related_properties": {}
              }
            ],
            "operation": "UPDATE"
        }
        
        setShowModal(true);

        let postParams = {
          thost: props.state.cfg.thost,
          tport: props.state.cfg.tport,
          tid: props.state.cfg.tid,
          token: props.state.token,
          body: updtBody
        };

        postSMAXData(postParams)
        .then(response => {
          console.log(response.data);
          setNeedSave(false);
          setShowModal(false);
        })
        .catch(function (error) {
            console.log(error);
          }
        )
    }

    if (svgLink !== null) {
      return (
        <div>
          {renderContent()}
          {renderList()}
          {renderModal()}
        </div>          
      )
    } else return '';
  }
