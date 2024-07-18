import React, { Component, PropTypes } from 'react';

import { Segment, Form, Grid } from 'semantic-ui-react';

import Input from './Valid/Input';
import File from './Valid/File';
import Wysiwyg from './Valid/Wysiwyg';

class Valid extends Component {
	static Input = Input;
	static File = File;
	static Wysiwyg = Wysiwyg;

    render() {
        return <Segment/>
    }
}

export default Valid;
