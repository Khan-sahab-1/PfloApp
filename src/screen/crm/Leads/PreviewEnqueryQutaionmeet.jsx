// Bug ID 2822 start Jamshed
// Description: Refactored the PreviewEnqueryQutaionmeet component to handle inconsistent data formats and enhance the display of enquiry and quotation details. The component now normalizes incoming data to ensure it can handle both nested object formats and flat object formats seamlessly. Additionally, the UI has been improved to provide a clearer and more organized presentation of the enquiry/quotation information, including better handling of missing or optional fields. This refactor ensures that the component is more robust and can display data correctly regardless of its initial structure.
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import HeaderCompo from '../../../components/HeaderCompo';

const PreviewEnqueryQutaionmeet = ({route, navigation}) => {
  // Get the data array from route params
  const dataArray = route?.params?.data?.data || route?.params?.data || [];
  const enquiries = Array.isArray(dataArray) ? dataArray : [dataArray];
  const {qutation} = route?.params;
  console.log(qutation);
  // console.log(dataArray, 'Data Array');

  console.log('Total Enquiries:', enquiries);

  const StatusBadge = ({status = 'draft'}) => {
    const safeStatus = String(status).toLowerCase();

    return (
      <View style={[styles.badge, styles[`badge${safeStatus}`]]}>
        <Text style={styles.badgeText}>{safeStatus.toUpperCase()}</Text>
      </View>
    );
  };

  // const EnquiryCard = ({item, index}) => {
  //   console.log(item);
  //   return (
  //     <TouchableOpacity style={styles.card} activeOpacity={0.7}>
  //       {/* Header Section */}
  //       <View style={styles.cardHeader}>
  //         <View style={styles.headerLeft}>
  //           <Text style={styles.enquiryNumber}>
  //             {item?.name || item?.display_name}
  //           </Text>
  //           {/* <Text style={styles.enquiryType}>
  //                       {item?.enquiry_type === 'budgetory' ? '💰 Budgetary' : '📋 Formal'} Enquiry
  //                   </Text> */}
  //         </View>
  //         {qutation !== 'Meetings' && (
  //           <StatusBadge status={item?.state || 'draft'} />
  //         )}
  //       </View>

  //       {/* Expired Warning */}
  //       {/* {item?.is_expired && ( p
  //       <View style={styles.expiredBanner}>
  //         <Text style={styles.expiredText}>⚠ Expired</Text>
  //       </View>
  //     )} */}

  //       {/* Divider */}
  //       <View style={styles.divider} />

  //       {/* Info Section */}
  //       <View style={styles.infoSection}>
  //         {/* Order Date */}
  //         {qutation !== 'Meetings' && (
  //           <View style={styles.infoRow}>
  //             {qutation === 'Qutation' ? (
  //               <Text style={styles.infoLabel}>📅 Qutation Date:</Text>
  //             ) : (
  //               <Text style={styles.infoLabel}>📅 Enquiry Date:</Text>
  //             )}
  //             <Text style={styles.infoValue}>
  //               {item?.date_order
  //                 ? new Date(item.date_order).toLocaleDateString('en-IN', {
  //                     day: '2-digit',
  //                     month: 'short',
  //                     year: 'numeric',
  //                   })
  //                 : 'N/A'}
  //             </Text>
  //           </View>
  //         )}

  //         {/* Validity Date */}
  //         {/* <View style={styles.infoRow}>
  //         <Text style={styles.infoLabel}>⏰ Validity:</Text>
  //         <Text style={styles.infoValue}>
  //           {item?.validity_date
  //             ? new Date(item.validity_date).toLocaleDateString('en-IN', {
  //                 day: '2-digit',
  //                 month: 'short',
  //                 year: 'numeric',
  //               })
  //             : 'N/A'}
  //         </Text>
  //       </View> */}

  //         {/* Client Order Ref */}
  //         {/* Selected Enquiry Number */}
  //         {qutation === 'Qutation' && item?.enquiry_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Enquiry Number:</Text>
  //             <Text style={styles.infoValue}>{item.enquiry_id[1]}</Text>
  //           </View>
  //         )}
  //         {qutation === 'Meetings' && item?.display_start && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Start Date :</Text>
  //             <Text style={styles.infoValue}>{item.display_start}</Text>
  //           </View>
  //         )}
  //         {qutation === 'Meetings' && item?.stop && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> End Date :</Text>
  //             <Text style={styles.infoValue}>{item.stop}</Text>
  //           </View>
  //         )}
  //         {qutation === 'Meetings' && item?.location && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Location :</Text>
  //             <Text style={styles.infoValue}>{item.location}</Text>
  //           </View>
  //         )}
  //         {qutation === 'Meetings' && item?.duration && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Duration :</Text>
  //             <Text style={styles.infoValue}>{item.duration} Hour</Text>
  //           </View>
  //         )}
  //         {qutation === 'Qutation' && item?.quotation_type && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Qutation Type:</Text>
  //             <Text style={styles.infoValue}>{item.quotation_type}</Text>
  //           </View>
  //         )}

  //         {qutation !== 'Meetings' && item?.partner_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Customer:</Text>
  //             <Text style={styles.infoValue}>{item.partner_id[1]}</Text>
  //           </View>
  //         )}
  //         {qutation !== 'Meetings' && item?.employee_division_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Division:</Text>
  //             <Text style={styles.infoValue}>
  //               {item.employee_division_id[1]}
  //             </Text>
  //           </View>
  //         )}
  //         {qutation !== 'Meetings' && item?.user_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Salesperson:</Text>
  //             <Text style={styles.infoValue}>{item.user_id[1]}</Text>
  //           </View>
  //         )}
  //         {item?.account_holder_saleperson_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}> Account Holder:</Text>
  //             <Text style={styles.infoValue}>
  //               {item.account_holder_saleperson_id[1]}
  //             </Text>
  //           </View>
  //         )}
  //         {item?.employee_dividion_id && (
  //           <View style={styles.infoRow}>
  //             <Text style={styles.infoLabel}>🔖 Division:</Text>
  //             <Text style={styles.infoValue}>
  //               {item.employee_dividion_id[1]}
  //             </Text>
  //           </View>
  //         )}
  //         {/* {item?.write_uid && (
  //         <View style={styles.infoRow}>
  //           <Text style={styles.infoLabel}>🔖 write_uid:</Text>
  //           <Text style={styles.infoValue}>{item.write_uid[1]}</Text>
  //         </View>
  //       )} */}

  //         {/* Selected Enquiry Number */}
  //         {/* {item?.selected_enquiry_number && (
  //         <View style={styles.infoRow}>
  //           <Text style={styles.infoLabel}>🔗 Selected Enquiry:</Text>
  //           <Text style={styles.infoValue}>{item.selected_enquiry_number}</Text>
  //         </View>
  //       )} */}

  //         {/* Address */}
  //         {/* {item?.partner_address && (
  //         <View style={styles.addressRow}>
  //           <Text style={styles.infoLabel}>📍 Address:</Text>
  //           <Text style={styles.addressValue} numberOfLines={2}>
  //             {item.partner_address.replace(/\n/g, ', ')}
  //           </Text>
  //         </View>
  //       )} */}

  //         {/* Description */}
  //         {/* {item?.description && item?.description !== '' && (
  //         <View style={styles.descriptionRow}>
  //           <Text style={styles.infoLabel}>📝 Description:</Text>
  //           <Text style={styles.descriptionValue} numberOfLines={2}>
  //             {item.description}
  //           </Text>
  //         </View>
  //       )} */}
  //       </View>

  //       {/* Footer Section */}
  //       <View style={styles.footer}>
  //         {/* <View style={styles.footerItem}>
  //         <Text style={styles.footerLabel}>Created</Text>
  //         <Text style={styles.footerValue}>
  //           {item?.create_date
  //             ? new Date(item.create_date).toLocaleDateString('en-IN', {
  //                 day: '2-digit',
  //                 month: 'short',
  //               })
  //             : 'N/A'}
  //         </Text>
  //       </View> */}
  //         {/* <View style={styles.footerDivider} />
  //       <View style={styles.footerItem}>
  //         <Text style={styles.footerLabel}>Attachments</Text>
  //         <Text style={styles.footerValue}>
  //           📎 {item?.count_attachment || 0}
  //         </Text>
  //       </View> */}
  //         <View style={styles.footerDivider} />
  //         {qutation !== 'Meetings' && (
  //           <View style={styles.footerItem}>
  //             <Text style={styles.footerLabel}>Amount</Text>
  //             <Text style={[styles.footerValue, styles.amountText]}>
  //               ₹{Number(item?.amount_total || 0).toFixed(2)}
  //             </Text>
  //           </View>
  //         )}
  //       </View>
  //     </TouchableOpacity>
  //   );
  // };

  const EnquiryCard = ({item, index}) => {
    // Normalize the item to handle both formats
    const normalizeItem = rawItem => {
      if (!rawItem) return null;

      // If it's in format {"807": {data...}}
      if (typeof rawItem === 'object' && !Array.isArray(rawItem)) {
        const keys = Object.keys(rawItem);
        if (keys.length > 0) {
          // Get the first key-value pair
          const key = keys[0];
          const value = rawItem[key];

          // Ensure the nested object has the ID
          if (value && typeof value === 'object') {
            return {
              ...value,
              id: value.id || parseInt(key, 10), // Use either the nested id or the key as id
            };
          }
        }
      }

      // If it's already in the correct format, return as is
      return rawItem;
    };

    const normalizedItem = normalizeItem(item);

    if (!normalizedItem) {
      return (
        <View style={[styles.card, styles.errorCard]}>
          <Text style={styles.errorText}>Invalid data format</Text>
        </View>
      );
    }

    // Debug log to see the normalized item
    console.log('Original item:', item);
    console.log('Normalized item:', normalizedItem);

    return (
      <TouchableOpacity style={styles.card} activeOpacity={0.7}>
        {/* Header Section */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.enquiryNumber}>
              {normalizedItem?.name || normalizedItem?.display_name}
            </Text>
          </View>
          {qutation !== 'Meetings' && (
            <StatusBadge status={normalizedItem?.state || 'draft'} />
          )}
        </View>

        <View style={styles.divider} />

        {/* Info Section */}
        <View style={styles.infoSection}>
          {/* Order Date */}
          {qutation !== 'Meetings' && (
            <View style={styles.infoRow}>
              {qutation === 'Qutation' ? (
                <Text style={styles.infoLabel}>📅 Qutation Date:</Text>
              ) : (
                <Text style={styles.infoLabel}>📅 Enquiry Date:</Text>
              )}
              <Text style={styles.infoValue}>
                {normalizedItem?.date_order
                  ? new Date(normalizedItem.date_order).toLocaleDateString(
                      'en-IN',
                      {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      },
                    )
                  : 'N/A'}
              </Text>
            </View>
          )}
          {qutation === 'Qutation' && normalizedItem?.quotation_type && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Qutation Type:</Text>
              <Text style={styles.infoValue}>
                {normalizedItem.quotation_type}
              </Text>
            </View>
          )}

          {qutation !== 'Meetings' && normalizedItem?.partner_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Customer:</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(normalizedItem.partner_id)
                  ? normalizedItem.partner_id[1]
                  : normalizedItem.partner_id}
              </Text>
            </View>
          )}
          {qutation === 'Qutation' && normalizedItem?.enquiry_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Enquiry Number:</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(normalizedItem.enquiry_id)
                  ? normalizedItem.enquiry_id[1]
                  : normalizedItem.enquiry_id}
              </Text>
            </View>
          )}

          {qutation === 'Meetings' && normalizedItem?.display_start && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Start Date :</Text>
              <Text style={styles.infoValue}>
                {normalizedItem.display_start}
              </Text>
            </View>
          )}

          {qutation === 'Meetings' && normalizedItem?.stop && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> End Date :</Text>
              <Text style={styles.infoValue}>{normalizedItem.stop}</Text>
            </View>
          )}

          {qutation === 'Meetings' && normalizedItem?.location && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Location :</Text>
              <Text style={styles.infoValue}>{normalizedItem.location}</Text>
            </View>
          )}

          {qutation === 'Meetings' && normalizedItem?.duration && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Duration :</Text>
              <Text style={styles.infoValue}>
                {normalizedItem.duration} Hour
              </Text>
            </View>
          )}

          {qutation !== 'Meetings' && normalizedItem?.employee_division_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Division:</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(normalizedItem.employee_division_id)
                  ? normalizedItem.employee_division_id[1]
                  : normalizedItem.employee_division_id}
              </Text>
            </View>
          )}

          {qutation !== 'Meetings' && normalizedItem?.user_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Salesperson:</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(normalizedItem.user_id)
                  ? normalizedItem.user_id[1]
                  : normalizedItem.user_id}
              </Text>
            </View>
          )}

          {normalizedItem?.account_holder_saleperson_id && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}> Account Holder:</Text>
              <Text style={styles.infoValue}>
                {Array.isArray(normalizedItem.account_holder_saleperson_id)
                  ? normalizedItem.account_holder_saleperson_id[1]
                  : normalizedItem.account_holder_saleperson_id}
              </Text>
            </View>
          )}
        </View>

        {/* Footer Section */}
        <View style={styles.footer}>
          <View style={styles.footerDivider} />
          {qutation !== 'Meetings' && (
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>Amount</Text>
              <Text style={[styles.footerValue, styles.amountText]}>
                ₹{Number(normalizedItem?.amount_total || 0).toFixed(2)}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <HeaderCompo
        title={'Preview'}
        lefticon={require('../../../assets/back.png')}
        onPress={() => navigation.goBack()}
      />

      {/* Count Badge */}
      {/* <View style={styles.countBadge}>
                <Text style={styles.countText}>Total Enquiries: {enquiries.length}</Text>
            </View> */}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {enquiries.map((item, index) => (
          <EnquiryCard key={item?.id || index} item={item} index={index} />
        ))}

        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
};

export default PreviewEnqueryQutaionmeet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  countBadge: {
    backgroundColor: '#3B82F6',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  countText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  enquiryNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  enquiryType: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgedraft: {
    backgroundColor: '#FEF3C7',
  },
  badgeconfirmed: {
    backgroundColor: '#D1FAE5',
  },
  badgecancelled: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  expiredBanner: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  expiredText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 12,
  },
  infoSection: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  addressRow: {
    marginBottom: 12,
  },
  addressValue: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
  },
  descriptionRow: {
    marginBottom: 12,
  },
  descriptionValue: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 4,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerItem: {
    flex: 1,
    // alignItems: 'center',
  },
  footerLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
    marginBottom: 4,
  },
  footerValue: {
    fontSize: 13,
    color: '#1A1A1A',
    fontWeight: '700',
  },
  amountText: {
    color: '#059669',
  },
  footerDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  bottomPadding: {
    height: 20,
  },
});
// Bug ID 2822 end jamshed
