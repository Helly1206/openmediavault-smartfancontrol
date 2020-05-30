# @license   http://www.gnu.org/licenses/gpl.html GPL Version 3
# @author    OpenMediaVault Plugin Developers <plugins@omv-extras.org>
# @copyright Copyright (c) 2019 OpenMediaVault Plugin Developers
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

{% set config = salt['omv_conf.get']('conf.service.smartfancontrol') %}

{% if config.enable | to_bool %}

{% if config.manual | to_bool %}

update_openmediavault_smartfancontrol_config:
  cmd.run:
    - name: "/opt/smartfancontrol/omv-smartfancontrol.py -d"

{% else %}

update_openmediavault_smartfancontrol_config:
  cmd.run:
    - name: "/opt/smartfancontrol/omv-smartfancontrol.py"

{% endif %}

start_smartfancontrol_service:
  test.succeed_with_changes:
    - watch_in:
      - service: start_smartfancontrol_service
  service.running:
    - name: smartfancontrol
    - enable: True

{% else %}

stop_smartfancontrol_service:
  service.dead:
    - name: smartfancontrol
    - enable: False
    
{% if config.manual | to_bool %}

update_openmediavault_smartfancontrol_config:
  cmd.run:
    - name: "/opt/smartfancontrol/omv-smartfancontrol.py"

{% endif %}

{% endif %}
