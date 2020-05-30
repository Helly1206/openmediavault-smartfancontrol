#!/bin/sh
#
# @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
# @author    Volker Theile <volker.theile@openmediavault.org>
# @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
# @copyright Copyright (c) 2009-2013 Volker Theile
# @copyright Copyright (c) 2013-2019 OpenMediaVault Plugin Developers
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

set -e

. /usr/share/openmediavault/scripts/helper-functions

SERVICE_XPATH_NAME="smartfancontrol"
SERVICE_XPATH="/config/services/${SERVICE_XPATH_NAME}"

if ! omv_config_exists "${SERVICE_XPATH}"; then
    omv_config_add_node "/config/services" "${SERVICE_XPATH_NAME}"
    omv_config_add_key "${SERVICE_XPATH}" "enable" "0"
    omv_config_add_key "${SERVICE_XPATH}" "manual" "0"
    omv_config_add_node "${SERVICE_XPATH}" "fan" ""
    omv_config_add_key "${SERVICE_XPATH}/fan" "mode" "RPM"
    omv_config_add_key "${SERVICE_XPATH}/fan" "ONOFFgpio" "27"
    omv_config_add_key "${SERVICE_XPATH}/fan" "ONOFFinvert" "0"
    omv_config_add_key "${SERVICE_XPATH}/fan" "PWMcalibrated" "5.0"
    omv_config_add_key "${SERVICE_XPATH}/fan" "PWMgpio" "18"
    omv_config_add_key "${SERVICE_XPATH}/fan" "PWMfrequency" "10000"
    omv_config_add_key "${SERVICE_XPATH}/fan" "PWMinvert" "0"
    omv_config_add_key "${SERVICE_XPATH}/fan" "recalibrate" "7"
    omv_config_add_key "${SERVICE_XPATH}/fan" "RPMgpio" "17"
    omv_config_add_key "${SERVICE_XPATH}/fan" "RPMpullup" "1"
    omv_config_add_key "${SERVICE_XPATH}/fan" "RPMppr" "2"
    omv_config_add_key "${SERVICE_XPATH}/fan" "RPMedge" "1"
    omv_config_add_key "${SERVICE_XPATH}/fan" "RPMfiltersize" "0"
    omv_config_add_key "${SERVICE_XPATH}/fan" "Frequency" "10"
    omv_config_add_key "${SERVICE_XPATH}/fan" "Pgain" "0.1"
    omv_config_add_key "${SERVICE_XPATH}/fan" "Igain" "0.2"
    omv_config_add_node "${SERVICE_XPATH}" "temp" ""
    omv_config_add_key "${SERVICE_XPATH}/temp" "cpu" "1"
    omv_config_add_key "${SERVICE_XPATH}/temp" "hdd" ""
    omv_config_add_key "${SERVICE_XPATH}/temp" "ext" ""
    omv_config_add_key "${SERVICE_XPATH}/temp" "mode" "MAX"
    omv_config_add_key "${SERVICE_XPATH}/temp" "Farenheit" "0"
    omv_config_add_key "${SERVICE_XPATH}/temp" "AlarmHigh" "65.0"
    omv_config_add_key "${SERVICE_XPATH}/temp" "AlarmCrit" "80.0"
    omv_config_add_key "${SERVICE_XPATH}/temp" "AlarmShutdown" "TRUE"
    omv_config_add_node "${SERVICE_XPATH}" "control" ""
    omv_config_add_key "${SERVICE_XPATH}/control" "mode" "PI"
    omv_config_add_key "${SERVICE_XPATH}/control" "TempOn" "55.0"
    omv_config_add_key "${SERVICE_XPATH}/control" "TempHyst" "5.0"
    omv_config_add_key "${SERVICE_XPATH}/control" "TempStart" "45.0"
    omv_config_add_key "${SERVICE_XPATH}/control" "TempFull" "65.0"
    omv_config_add_key "${SERVICE_XPATH}/control" "LinSteps" "2.5"
    omv_config_add_key "${SERVICE_XPATH}/control" "Frequency" "1"
    omv_config_add_key "${SERVICE_XPATH}/control" "Pgain" "0.1"
    omv_config_add_key "${SERVICE_XPATH}/control" "Igain" "0.1"
    
    /opt/smartfancontrol/omv-smartfancontrol.py -d
fi

exit 0
