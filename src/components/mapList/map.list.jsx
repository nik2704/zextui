import React from "react";

export class MapList extends React.Component {
    onSelectItem(id, file_name) {
        let newSelection = {
            id: id,
            file_name: file_name
        };

        let selectedMap = this.props.state.selectedMap.id !== null ? this.props.state.selectedMap : newSelection;
        this.props.switchStateField(['tmpSelectedMap', 'selectedMap'], [selectedMap, newSelection]);
    }

    renderFileList() {
        if (this.props.state.fetchedData.locationFiles !== undefined) {
            const locationFiles = this.props.state.fetchedData.locationFiles;

            if (locationFiles.length > 0) {
                return locationFiles.map((item, idx) => {
                    return (
                        <div className='item' key={item.id} onClick={() => this.onSelectItem(item.id, item.file_name)}>
                            <i className={item.id === this.props.state.selectedMap.id ? 'large toggle on middle aligned icon green' : 'large toggle off middle aligned icon disabled'}></i>
                            <div className="content">
                                <p className="header">{`${idx + 1}). ${item.file_name}`}</p>
                            </div>
                        </div>
                    )
                });
            }
            
        }

        return '';
    }    
    render() {
        return (
            <div className="ui relaxed divided list">
                {this.renderFileList()}
            </div>
        )
    }
}

