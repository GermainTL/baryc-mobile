import React, { Component, useContext } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Text,
} from 'react-native';
import Dash from 'react-native-dash';
import { Icon, ButtonGroup, Button, Slider } from 'react-native-elements';
import { getBarsFromApi } from '~/helpers/API/BarsAPI.tsx';
import { getMarkersFromBars } from '~/helpers/MarkersHelper.tsx';
import { geocode } from '~/helpers/API/Geocoder.tsx';
import transportOptions from '~/constants/TransportOptions.tsx';
import SearchBarWithOptions from '~/components/SearchBarWithOptions.tsx';
import { retrieveNewMapElements } from '~/helpers/CoordinatesHelper.tsx';
import Map from '~/components/Map.tsx';
import BarycLoader from '~/components/BarycLoader';
import CoolSliderThumb from '~/components/CoolSliderThumb.tsx';
import * as i18n from '~/helpers/i18n.js';
import palette from '~/constants/Colors.ts';
import { connect } from 'react-redux';
import * as Location from 'expo-location';

const INITIAL_STATE = {
  markers: [],
  isLoading: true,
  showSearchPanel: false,
  locations: [
    {
      searchValue: '',
      GPSPosition: {
        latitude: null,
        longitude: null,
      },
      options: [],
    },
    {
      searchValue: '',
      GPSPosition: {
        latitude: null,
        longitude: null,
      },
      options: [],
    },
  ],
  isUserGPSLocationUsed: false,
  travelTime: 30,
  selectedTransport: 'walking',
  isochronesCoordinates: [
    {
      reformattedCoordinates: [],
      coordinates: [],
    },
  ],
  intersection: null,
};

class TabMapScreen extends Component {
  constructor() {
    super();
    this.state = INITIAL_STATE;
  }

  async componentDidMount(): void {
    if (this.props.bars === null) {
      const bars = await getBarsFromApi()
        const markers = getMarkersFromBars(bars);
        this.setState({
          markers: markers,
          isLoading: false,
        });
    } else {
      const markers = getMarkersFromBars(this.props.bars);
      this.setState({
        markers: markers,
        isLoading: false,
      });
    }
    this.initializeUserLocation();
  }

  async initializeUserLocation(): void {
    const locations = [...this.state.locations];

    let userCoordinates = {};
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status == 'granted') {
        userCoordinates = await Location.getCurrentPositionAsync({
          accuracy: 5,
        });
      }
      locations[0].GPSPosition.latitude = userCoordinates.coords.latitude;
      locations[0].GPSPosition.longitude = userCoordinates.coords.longitude;
      this.setState({ locations: locations, isUserGPSLocationUsed: true });
    } catch (error) {
      const action = {
        type: 'DISPLAY_NOTIFICATION',
        notificationText: i18n.t('global.error'),
      };
      this.props.dispatch(action);
    }
  }

  togglePanel(): void {
    this.setState(prevState => {
      return {
        showSearchPanel: prevState.showSearchPanel !== true,
      };
    });
  }

  handleScrollOnPanel(event: Object): void {
    const contentOffsetY = event.nativeEvent.contentOffset.y;
    if (contentOffsetY < -30) {
      this.togglePanel();
    }
  }

  updateSelectTransport(selectedTransport): void {
    this.setState({ selectedTransport: selectedTransport });
  }

  handleSearch(searchText, index): void {
    if (searchText === '') {
      return;
    }
    const locations = [...this.state.locations];
    const location = { ...locations[index] };
    location.searchValue = searchText;
    locations[index] = location;

    this.setState({ locations: locations });

    geocode(searchText).then(data => {
      const locations = [...this.state.locations];
      const location = { ...locations[index] };
      location.options = data;
      locations[index] = location;
      this.setState({ locations: locations });
    });
  }

  addLocation(): void {
    const action = {
      type: 'DISPLAY_NOTIFICATION',
      notificationText: i18n.t('global.moreThan2NotWorkingYet'),
    };
    this.props.dispatch(action);
    /* const locations = [ ...this.state.locations ]
    locations.push({
      searchValue: '',
      GPSPosition: {
        latitude: null,
        longitude: null
      },
      options: []
    })
    this.setState({ locations: locations }) */
  }

  selectLocation(location: Object, index: Number): void {
    let isUserGPSLocationUsed = JSON.parse(
      JSON.stringify(this.state.isUserGPSLocationUsed),
    );
    const locations = [...this.state.locations];
    locations[index] = location;

    if (index === 0) {
      isUserGPSLocationUsed = false;
    }
    this.setState({
      locations: locations,
      isUserGPSLocationUsed: isUserGPSLocationUsed,
    });
  }

  clearLocation(index): void {
    const isUserGPSLocationUsed = JSON.parse(
      JSON.stringify(this.state.isUserGPSLocationUsed),
    );
    const locations = [...this.state.locations];
    locations[index] = INITIAL_STATE.locations[index];
    this.setState({
      locations: locations,
      isUserGPSLocationUsed: index === 0 ? false : isUserGPSLocationUsed,
    });
  }

  searchBarPlaceHolder(index): string {
    if (index === 0) {
      return this.state.isUserGPSLocationUsed
        ? i18n.t('TabMapScreen.currentLocationUsed')
        : i18n.t('TabMapScreen.myPosition');
    }
    return i18n.t('TabMapScreen.positionNumber', { positionNumber: index });
  }

  onSearchButtonPress(): void {
    this.setState({
      isLoading: true,
    });

    retrieveNewMapElements(
      this.state.locations,
      this.state.travelTime,
      this.state.selectedTransport,
    ).then(newMapElements => {
      this.setState({
        isochronesCoordinates: newMapElements.newIsochronesCoordinates,
        intersection: newMapElements.newIntersection,
        markers: newMapElements.newMarkers || this.state.markers,
        showSearchPanel: false,
        isLoading: false,
      });
    });
  }

  render(): JSX.Element {
    const {
      markers,
      isLoading,
      showSearchPanel,
      selectedTransport,
      locations,
      isochronesCoordinates,
      intersection,
    } = this.state;
    return (
      <View style={styles.container}>
        <BarycLoader
          visible={isLoading}
          containerStyle={styles.loaderContainer}
          type={'rotating'}
        />
        {showSearchPanel === false && isLoading === false && (
          <Map
            isLoading={isLoading}
            markers={markers}
            isochronesCoordinates={isochronesCoordinates}
            intersection={intersection}
            navigation={this.props.navigation}
            locations={locations}
            key={JSON.stringify(locations)}
          />
        )}
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => this.togglePanel()}
        >
          <Icon
            name="search-outline"
            reverse
            type="ionicon"
            color="white"
            reverseColor="black"
          />
        </TouchableOpacity>

        {showSearchPanel === true && (
          <ScrollView
            onScrollEndDrag={this.handleScrollOnPanel.bind(this)}
            contentContainerStyle={styles.searchPanel}
            scrollEventThrottle={15}
          >
            <Icon
              name="chevron-double-down"
              type="material-community"
              color="#C4C4C4"
              style={styles.scrollDownIcon}
            />

            <Text style={styles.title}> {i18n.t('TabMapScreen.title')}</Text>

            <Dash
              dashColor={palette.orangeLight}
              style={[styles.dash, { width: 2, height: 20 }]}
            />

            <View style={styles.searchBars}>
              {locations.map((location, index) => {
                return (
                  <SearchBarWithOptions
                    handleSearch={this.handleSearch.bind(this)}
                    clearLocation={this.clearLocation.bind(this)}
                    selectLocation={this.selectLocation.bind(this)}
                    placeholder={this.searchBarPlaceHolder(index)}
                    isLastSearchBar={index === locations.length - 1}
                    value={location.searchValue}
                    options={location.options}
                    locationIndex={index}
                    isGPSUsed={index === 0 && this.state.isUserGPSLocationUsed}
                    key={index}
                    containerStyle={[
                      { zIndex: locations.length - index },
                      styles.searchBar,
                    ]}
                  />
                );
              })}
              {locations.length < 4 && (
                <TouchableOpacity
                  style={styles.addFriendBtn}
                  onPress={this.addLocation.bind(this)}
                >
                  <Text style={styles.addFriendBtnText}>
                    + {i18n.t('TabMapScreen.addFriend')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Dash
              dashColor={palette.orangeLight}
              style={[styles.dash, { width: 1, height: 30 }]}
            />

            <View style={styles.searchParameter}>
              <View style={styles.sliderContainer}>
                <Text style={styles.parameterLabel}>
                  {i18n.t('TabMapScreen.travelTime')} :
                </Text>
                <Slider
                  value={this.state.travelTime}
                  maximumValue={45}
                  minimumValue={5}
                  step={1}
                  onValueChange={travelTime =>
                    this.setState({ travelTime: travelTime })
                  }
                  style={{ marginLeft: 15, marginRight: 15, marginBottom: 0 }}
                  trackStyle={{
                    height: 2,
                    backgroundColor: 'transparent',
                    marginBottom: 0,
                  }}
                  minimumTrackTintColor={palette.orangeLight}
                  thumbStyle={{
                    height: 10,
                    width: 10,
                    backgroundColor: 'white',
                    borderColor: palette.grey,
                    borderWidth: 0.32,
                  }}
                  thumbProps={{
                    children: <CoolSliderThumb value={this.state.travelTime} />,
                  }}
                />
                <View style={styles.sliderLegend}>
                  <Text style={styles.sliderLegentText}>5 min</Text>
                  <Text style={styles.sliderLegentText}>45 min</Text>
                </View>
              </View>

              <Text style={styles.parameterLabel}>
                {i18n.t('TabMapScreen.meansOfTransport')} :
              </Text>
              <ButtonGroup
                containerStyle={{ zIndex: 0 }}
                buttonContainerStyle={{ paddingTop: 8 }}
                onPress={index =>
                  this.updateSelectTransport(
                    transportOptions(selectedTransport)[index].value,
                  )
                }
                buttons={transportOptions(selectedTransport).map(
                  transportOption => {
                    return transportOption.displayValue;
                  },
                )}
              />
            </View>

            <Dash
              dashColor={palette.orangeLight}
              style={[styles.dash, { width: 1, height: 20 }]}
            />

            <Button
              raised={true}
              title={i18n.t('TabMapScreen.search')}
              titleStyle={styles.submitButtonText}
              buttonStyle={styles.submitButton}
              containerStyle={styles.submitButtonContainer}
              onPress={() => this.onSearchButtonPress()}
            />
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = (state): Object => {
  return {
    bars: state.bars,
  };
};
export default connect(mapStateToProps)(TabMapScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loaderContainer: {
    zIndex: 1000,
    position: 'absolute',
    alignSelf: 'center',
    top: '33%',
  },
  map: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
  },
  searchButton: {
    backgroundColor: 'transparent',
    flex: 1,
    position: 'absolute',
    bottom: 0,
    right: 0,
    color: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.2,
    elevation: 1,
  },
  addFriendBtn: {
    position: 'absolute',
    bottom: -20,
  },
  addFriendBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.orangeLight,
  },
  searchPanel: {
    zIndex: 3,
    flex: 1,
    height: '100%',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: 'white',
  },
  scrollDownIcon: {
    marginTop: 20,
    marginBottom: 20,
  },
  dash: {
    marginLeft: '50%',
    marginBottom: 2,
    flexDirection: 'column',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.greyDark,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  searchBars: {
    borderColor: palette.grey,
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10,
    zIndex: 5,
  },
  searchParameter: {
    zIndex: 1,
    marginLeft: 10,
    marginRight: 10,
    borderColor: palette.grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  parameterLabel: {
    fontSize: 12,
    color: palette.greyDark,
    fontWeight: '500',
    marginBottom: 5,
  },
  searchBar: {},
  transportButtons: {
    zIndex: 0,
  },
  sliderContainer: {
    marginBottom: 5,
  },
  sliderLegend: {
    marginTop: -15,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLegentText: {
    fontSize: 10,
    color: palette.grey,
  },
  selectedTransportBtn: {},
  submitButtonText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  submitButton: {
    backgroundColor: palette.orangeLight,
  },
  submitButtonContainer: {
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
  },
});
