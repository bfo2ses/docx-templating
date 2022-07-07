const path = require('path')
const fs = require('fs-extra')
const docx = require('../dist')

const data = {
    demande: {
        id: 'abaa61ed-4173-4ef1-87d3-cecbba1573f6',
        idContrat: 29611,
        idRefinanceur: 166,
        date: null,
        montant: 225000,
        duree: 36,
        tauxVR: 5,
        loyer: 6216.38,
        periodicite: 'mensuelle',
        commentaire: '',
        etat: 'en_cours',
        createdAt: '2020-01-02T18:08:23.000Z',
        updatedAt: '2020-01-02T18:08:23.000Z',
        contrat: {
            periodicite: 'mensuelle',
            paiementDebutDeMois: 1,
            dateAnniversaireDeMiseEnPlace: '2021-01-15',
            id_contrat: 29611,
            idAssistante: 232,
            idClient: 12435,
            idRefinanceur: 166,
            idPere: 25567,
            filiale: 'USA',
            numero: '2018091952-1/PC',
            millesime: 2019,
            millesimeAffectation: 2019,
            millesimeClient: 0,
            aUneFacture: false,
            type: 'contrat',
            typeAvenant: '',
            autoporte: false,
            evolutionClient: 'croissance_1',
            etape: 'pre_contrat',
            dateMiseEnPlace: '2020-01-15',
            modeDeReglement: 0,
            pvFacture: 213,
            tauxRefinanceur: 0,
            dureeCessionRefinanceur: 6216,
            duree: '6216.38',
            encoursCommercial: 105469,
            encoursContratRefinanceur: 0,
            encoursAvenantRefinanceur: 0,
            calageEnCours: '',
            vnc: 0,
            tauxValeurResiduelle: null,
            valeurResiduelle: 0,
            isLoyerLineaire: true,
            loyerLineaire: 6216.38,
            dureeDeLaPeriode1: 0,
            dureeDeLaPeriode2: 0,
            dureeDeLaPeriode3: 0,
            dureeDeLaPeriode4: 0,
            dureeDeLaPeriode5: 0,
            dureeDeLaPeriode6: 0,
            dureeDeLaPeriode7: 0,
            dureeDeLaPeriode8: 0,
            loyerDeLaPeriode1: 0,
            loyerDeLaPeriode2: 0,
            loyerDeLaPeriode3: 0,
            loyerDeLaPeriode4: 0,
            loyerDeLaPeriode5: 0,
            loyerDeLaPeriode6: 0,
            loyerDeLaPeriode7: 0,
            loyerDeLaPeriode8: 0,
            termeEchu: false,
            termeEchoir: true,
            investissementPrevisionnel: 70000,
            contratSupprime: false,
            numeroFacture: '',
            dateFacture: '0000-00-00',
            etat: 'en_cours',
            timestampAjout: null,
            id_contrat_pere: 25567,
            id_prevision_vente: 9278,
            id_refinanceur: 166,
            id_assistante: 232
        },
        refinanceur: {
            id: 166,
            nom: 'Bank of the Beast',
            etat: 'actif',
            filiales: '["USA"]'
        }
    },
    opportunite: {
        id: 'be141de9-253f-4d6a-9659-763e9c5664c1',
        nom: 'RENEWAL SLOCA 2016',
        type: 'annule_remplace',
        offre: 'barriques',
        millesime: 2019,
        etape: 'proposition',
        devise: 'USD',
        filiale: 'USA',
        chiffreAffaire: 213940.7,
        valeurAjoutee: 33758.38,
        traitementFinancier: null,
        accordRefinanceur: 0,
        probabilite: 100,
        updatedAt: '2019-12-31T19:48:55.000Z',
        idCommercial: 228,
        idClient: 12435,
        dateMiseEnPlace: '2019-12-15',
        dateSignature: '2020-11-15',
        client: { nom: 'SLICA, INC.' },
    },
    commercial: {
        nomCompletAbrege: 'Jul. Mit.',
        nom: 'Mitte',
        prenom: 'Julienne',
        initiales: 'JM'
    },
    anciensInvestissements: [
        // { millesime: '2018', quantite: 112 },
        // { millesime: '2017', quantite: 78 }
    ],
    nouveauxInvestissements: { millesime: '2019', quantite: 70 },
    utilisateur: {
        id: '155',
        prenom: 'Carmelito',
        nom: 'Santa',
        nomComplet: 'Carmelito Santa',
        email: 'carmelito.santa@test.fr'
    },
    refinanceur: {
        id: 166,
        nom: 'Bank of the West',
        filiales: '["USA"]',
        etat: 'actif',
        idRefinanceur: 166,
        contactRefinanceur: {
            id: '4d3321e1-a300-492c-86aa-882efb515910',
            nom: 'de Knwon',
            prenom: 'Chris',
            email: 'Chris.DeKKnwon@bankofthebeast.com',
            cc: 'test@test.fr'
        },
        contact: { nomComplet: 'Chris de Knwon' }
    },
    contrat: {
        periodicite: 'mensuelle',
        paiementDebutDeMois: 1,
        dateAnniversaireDeMiseEnPlace: '2021-01-15',
        id_contrat: 29611,
        idAssistante: 232,
        idClient: 12435,
        idRefinanceur: 166,
        idPere: 25567,
        filiale: 'USA',
        numero: '2018091952-1/PC',
        millesime: 2019,
        millesimeAffectation: 2019,
        millesimeClient: 0,
        aUneFacture: false,
        type: 'contrat',
        typeAvenant: '',
        autoporte: false,
        evolutionClient: 'croissance_1',
        etape: 'pre_contrat',
        dateMiseEnPlace: '2020-01-15',
        modeDeReglement: 0,
        pvFacture: 213,
        tauxRefinanceur: 0,
        dureeCessionRefinanceur: 6216,
        duree: '6216.38',
        encoursCommercial: 105469,
        encoursContratRefinanceur: 0,
        encoursAvenantRefinanceur: 0,
        calageEnCours: '',
        vnc: 0,
        tauxValeurResiduelle: null,
        valeurResiduelle: 0,
        isLoyerLineaire: true,
        loyerLineaire: 6216.38,
        dureeDeLaPeriode1: 0,
        dureeDeLaPeriode2: 0,
        dureeDeLaPeriode3: 0,
        dureeDeLaPeriode4: 0,
        dureeDeLaPeriode5: 0,
        dureeDeLaPeriode6: 0,
        dureeDeLaPeriode7: 0,
        dureeDeLaPeriode8: 0,
        loyerDeLaPeriode1: 0,
        loyerDeLaPeriode2: 0,
        loyerDeLaPeriode3: 0,
        loyerDeLaPeriode4: 0,
        loyerDeLaPeriode5: 0,
        loyerDeLaPeriode6: 0,
        loyerDeLaPeriode7: 0,
        loyerDeLaPeriode8: 0,
        termeEchu: false,
        termeEchoir: true,
        investissementPrevisionnel: 70000,
        contratSupprime: false,
        numeroFacture: '',
        dateFacture: '0000-00-00',
        etat: 'en_cours',
        timestampAjout: null,
        id_contrat_pere: 25567,
        id_prevision_vente: 9278,
        id_refinanceur: 166,
        id_assistante: 232,
    },
    client: {
        id_client: 12435,
        idRib: 2706,
        nom: 'SLOCA, INC. & Test',
        idCommercial: 228,
        langueDesDocuments: 'en',
        nomCommercial: 'KING WINES & toto',
        nomDeRue: '5885 Vista Del Pais',
        complementNomDeRue: '',
        codePostal: '93446',
        ville: 'Paso Robles',
        pays: 'USA',
        emailComptable: '',
        communicationElectronique: false,
        nomDeRueDeFacturation: '5885 Vista Del Paso',
        complementNomDeRueDeFacturation: '',
        complementNomDeRueBisDeFacturation: '',
        departementDeFacturation: 'CA',
        codePostalDeFacturation: '93446',
        villeDeFacturation: 'Paso Robles',
        paysFacturation: 'USA',
        siret: '',
        numeroIntracom: '',
        numeroIntermediaire: '',
        etat: 'actif'
    },
    documents: [
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=e1a5e33b7fb33e7a30daf1297faad393:ec9034d863f7bbf0615c97ee04822beea102f4e7300bf878095a7cb90d6a0dd0d045c4f04aa310fd017645582ba3ea8b5b52d066f80681f4841e1bdc381d34e8a69ff42c6fbd0be62c978f0281a27648566a24265750347abfc43fc5267559e7',
            text: 'Balance sheet-0.pdf'
        },
        {
            url: 'http://localhost:8181/documents/?c=2d9d2baa94b208f24de99f33d1479a2b:6bc21f4641c525e7256f0647d7b7573dfd6ab75db41ca670cbf21bd831c725434fb51b13160e2453350407dc490aeac6849d207a8aeb5f213b23b2e4fad5c27084dc1207f6927d6e4aa7cb966e824548ccc0c313f7263a0eea69cdc061059416',
            text: 'Financing request-0.pdf'
        }
    ]
}
const test = async (file) => {
    const word = await docx.Word
        .fromTemplate(`${file}.docx`, {
            path: path.dirname(__filename) + '/'
        })
        .setLocale('fr')
        .setData(data)
        .generate()
    await fs.writeFile(path.dirname(__filename) + `/${file}-result.docx`, word)
}

test('service-contract/FRANCE/service-contract-GOLD')
