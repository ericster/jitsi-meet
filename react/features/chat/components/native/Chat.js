// @flow

import React from 'react';
import { Text, View} from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';

import { translate } from '../../../base/i18n';
import { JitsiModal } from '../../../base/modal';
import { connect } from '../../../base/redux';
import { CHAT_VIEW_MODAL_ID } from '../../constants';
import AbstractChat, {
    _mapDispatchToProps,
    _mapStateToProps,
    type Props
} from '../AbstractChat';

import ChatInputBar from './ChatInputBar';
import MessageContainer from './MessageContainer';
import MessageRecipient from './MessageRecipient';

/**
 * Implements a React native component that renders the chat window (modal) of
 * the mobile client.
 */
class Chat extends AbstractChat<Props> {

    /**
     * Initializes a new Conference instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: Props) {
        super(props);
        this._onSend = this._onSend.bind(this);
        this._renderMessage = this._renderMessage.bind(this);
    }

    _onSend: (Array<Object>) => void;

    /**
     * Called by {@code render} to create the chat div.
     *
     * @param {string} message - The chat message to display.
     * @param {string} id - The chat message ID to use as a unique key.
     * @returns {Array<ReactElement>}
     */
    _onSend([ message ]) {
        this.props._onSendMessage(message.text);
    }

    _renderMessage: (Object) => void;

    /**
     * Called by {@code _onSubmitMessage} to create the chat message.
     *
     * @param {string} message - The chat message to display.
     * @param {string} id - The chat message ID to use as a unique key.
     * @returns {Array<ReactElement>}
     */
    _renderMessage(message: Object, id: string) {
        return (
            {
                _id: id,
                text: message.message,
                createdAt: new Date(message.timestamp),
                user: {
                    _id: message.id,
                    name: message.displayName
                }
            }
        );
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     */
    render() {
        const messages = this.props._messages.map(this._renderMessage);

        return (

            // <JitsiModal
            //     headerProps = {{
            //         headerLabelKey: 'chat.title'
            //     }}
            //     modalId = { CHAT_VIEW_MODAL_ID }>
            //     <MessageContainer messages = { this.props._messages } />
            //     <MessageRecipient />
            //     <ChatInputBar onSend = { this.props._onSendMessage } />
            // </JitsiModal>

            // <View >
            //     <Text>Hello {this.props._messages}!</Text>
            // </View>

            <GiftedChat
                messages = { messages.reverse() }
                onSend = { this._onSend }
                user = {{ _id: this.props._localParticipant.id }} />

        );
    }
}

export default translate(connect(_mapStateToProps, _mapDispatchToProps)(Chat));
