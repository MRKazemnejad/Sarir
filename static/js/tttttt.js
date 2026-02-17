# === 5. محاسبه مبالغ (همه Decimal) ===
        net_total = sum(p['subtotal'] for p in parts_data)

        # مالیات
        vat_enabled = request.POST.get('vat_enabled') == 'on'
        vat_percent = Decimal(request.POST.get('vat_percent', '0') or '0')
        vat_amount = net_total * (vat_percent / Decimal('100')) if vat_enabled else Decimal('0')

        base_with_vat = net_total + vat_amount

        # حسن انجام کار
        bond_enabled = request.POST.get('bond_enabled') == 'on'
        bond_percent = Decimal(request.POST.get('bond_percent', '0') or '0')
        bond_amount = net_total * (bond_percent / Decimal('100')) if bond_enabled else Decimal('0')

        #bimeh
        insurance_enabled = request.POST.get('insurance_enabled') == 'on'
        insurance_percent = Decimal(request.POST.get('insurance_percent', '0') or '0')
        insurance_amount = net_total * (insurance_percent / Decimal('100')) if insurance_enabled else Decimal('0')


        #prepayment
        prepayment_enabled = request.POST.get('prepayment_enabled') == 'on'
        prepayment_amount = Decimal(request.POST.get('prepayment_percent', '0') or '0')


        #total deductions
        total_deductions = prepayment_amount + insurance_amount + bond_amount


        final_total = base_with_vat - total_deductions

        # گرد کردن به عدد صحیح (چون decimal_places=0 در مدل)
        net_total = net_total.quantize(Decimal('1'))
        vat_amount = vat_amount.quantize(Decimal('1'))
        bond_amount = bond_amount.quantize(Decimal('1'))
        insurance_amount = insurance_amount.quantize(Decimal('1'))
        final_total = final_total.quantize(Decimal('1'))
