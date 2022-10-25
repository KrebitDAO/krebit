import { guild, role, user } from '@guildxyz/sdk';

const getGuild = async (guildId: string) => {
  return await guild.get(guildId);
};

const getRole = async (roleId: string) => {
  return await role.get(Number(roleId));
};

const getAddressGuilds = async (userAddress: string) => {
  const memberships = await user.getMemberships(userAddress);
  const result = await Promise.all(
    memberships.map(async m => {
      const guildInfo = await guild.get(m.guildId);

      return {
        text: guildInfo.name,
        value: m.guildId.toString()
      };
    })
  );
  return result;
};

const getAddressGuildAdmin = async (userAddress: string) => {
  const memberships = await user.getMemberships(userAddress);
  const result = await Promise.all(
    memberships.map(async m => {
      const guildInfo = await guild.get(m.guildId);
      let guildAmin = undefined;
      for (const a of guildInfo.admins) {
        if (a.address.toLowerCase() === userAddress.toLowerCase()) {
          guildAmin = {
            text: guildInfo.name,
            value: m.guildId.toString()
          };
        }
      }
      if (guildAmin) return guildAmin;
    })
  );
  return result.filter(g => g != undefined);
};

const getAddressRoles = async (guildId: string, userAddress: string) => {
  const memberships = await user.getMemberships(userAddress);

  for (const m of memberships) {
    if (m.guildId.toString() === guildId) {
      console.log('membership guildId', guildId);
      const roles = await Promise.all(
        // @ts-ignore: wrong type in original module
        m.roleIds.map(async r => {
          const roleInfo = await role.get(r);
          console.log('roleInfo', roleInfo);
          return {
            text: roleInfo.name,
            value: r.toString()
          };
        })
      );
      return roles;
    }
  }
};

const getGuildRoles = async (guildId: number, userAddress: string) => {
  const roles = await guild.getUserMemberships(guildId, userAddress);
  const actives = roles.filter(r => {
    return r.access ? true : false;
  });
};

export const guildXyz = {
  getGuild,
  getRole,
  getGuildRoles,
  getAddressGuilds,
  getAddressRoles,
  getAddressGuildAdmin
};
