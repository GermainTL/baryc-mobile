import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import palette from '~/constants/Colors.ts';
import { connect } from 'react-redux';
import { Button, Icon } from 'react-native-elements';

class Notification extends Component {
  closeNotification() {
    const action = { type: 'DISPLAY_NOTIFICATION', notificationText: null };
    this.props.dispatch(action);
  }

  render(): JSX.Element {
    return (
      <View
        style={[
          this.props.notificationContainerStyle,
          styles.notificationContainerStyle,
        ]}
      >
        <Button
          icon={
            <Icon
              name="close-circle"
              size={15}
              type="ionicon"
              color={palette.orangeLight}
              style={{ marginLeft: 5 }}
            />
          }
          title={`🤖 ${this.props.notificationText}`}
          iconRight
          type="clear"
          onPress={() => this.closeNotification()}
          titleStyle={styles.titleStyle}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    notificationText: state.notificationText,
  };
};
export default connect(mapStateToProps)(Notification);

const styles = StyleSheet.create({
  notificationContainerStyle: {
    flex: 1,
    flexDirection: 'row',
    position: 'absolute',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 'auto',
    bottom: 20,
    borderRadius: 3,
    borderColor: palette.grey,
    borderWidth: 0.32,
    paddingVertical: 4,
    paddingHorizontal: 6,
    left: '10%',
    width: '80%',
  },
  titleStyle: {
    color: palette.orangeLight,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
